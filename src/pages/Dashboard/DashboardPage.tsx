import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransactionFormData } from '../../types';
import { useTransactions } from '../../hooks/useTransactions';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import AnimatedCounter from '../../components/UI/AnimatedCounter';
import toast from 'react-hot-toast';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, MessageSquare, Trash2, RefreshCw } from 'lucide-react';

const schema = yup.object({
  date: yup.string().required('Date is required'),
  name: yup.string().required('Name is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  comment: yup.string().required('Comment is required'),
});

const DashboardPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [deletableTransactions, setDeletableTransactions] = useState<Set<string>>(new Set());
  const { transactions, isLoading, isCreating, createTransaction, deleteTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'income',
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      console.log(data)
      const newTransaction = await createTransaction(data);
      
      // Add transaction to deletable set
      console.log(newTransaction)
      setDeletableTransactions(prev => new Set(prev).add(newTransaction.id));
      
      
      // Remove delete button after 5 minutes
      setTimeout(() => {
        setDeletableTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(newTransaction.id);
          return newSet;
        });
      }, 5 * 60 * 1000); // 5 minutes
      
      reset();
      setShowForm(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Initialize deletable transactions on component mount
  useEffect(() => {
    const now = new Date().getTime();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    const recentTransactions = transactions.filter(transaction => {
      const transactionTime = new Date(transaction.createdAt).getTime();
      return transactionTime > fiveMinutesAgo;
    });
    
    const deletableIds = new Set(recentTransactions.map(t => t.id));
    setDeletableTransactions(deletableIds);
    
    // Set timeouts for existing recent transactions
    recentTransactions.forEach(transaction => {
      const transactionTime = new Date(transaction.createdAt).getTime();
      const timeRemaining = (5 * 60 * 1000) - (now - transactionTime);
      
      if (timeRemaining > 0) {
        setTimeout(() => {
          setDeletableTransactions(prev => {
            const newSet = new Set(prev);
            newSet.delete(transaction.id);
            return newSet;
          });
        }, timeRemaining);
      }
    });
  }, [transactions]);

  const handleDeleteTransaction = deleteTransaction;
   console.log(transactions)
const { totalIncome, totalExpenses } = transactions.reduce(
  (acc, t) => {
    const amount = Number(t.amount) || 0; // ensure numeric
    if (t.type === 'income') {
      acc.totalIncome += amount;
    } else if (t.type === 'expense') {
      acc.totalExpenses += amount;
    }
    return acc;
  },
  { totalIncome: 0, totalExpenses: 0 }
);

const netProfit = totalIncome - totalExpenses;

const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];


  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 text-white pt-16 lg:pt-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-8 text-white border border-white/20">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-white/80 text-sm lg:text-lg">Track your income and expenses with real-time insights</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="secondary"
            className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-black/30 text-sm lg:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Income</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={totalIncome} useCurrency />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-400/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-100" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Expenses</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={totalExpenses} useCurrency />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-400/30 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-red-100" />
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'}>Net Profit</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={netProfit} useCurrency />
              </p>
            </div>
            <div className={`w-10 h-10 lg:w-12 lg:h-12 ${netProfit >= 0 ? 'bg-blue-400/30' : 'bg-orange-400/30'} rounded-full flex items-center justify-center`}>
              <DollarSign className={`w-5 h-5 lg:w-6 lg:h-6 ${netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'}`} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Transactions</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={transactions.length} />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-purple-100" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="shadow-lg border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Add New Transaction</h2>
            <Button
              onClick={() => setShowForm(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Input
              label="Date"
              type="date"
              {...register('date')}
              error={errors.date?.message}
            />

            <Input
              label="Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Transaction name"
            />

            <Input
              label="Amount"
              type="number"
              step="0.01"
              {...register('amount')}
              error={errors.amount?.message}
              placeholder="0.00"
            />

            <Select
              label="Type"
              {...register('type')}
              error={errors.type?.message}
              options={typeOptions}
            />

            <div className="lg:col-span-2">
              <Input
                label="Comment"
                {...register('comment')}
                error={errors.comment?.message}
                placeholder="Add a comment about this transaction"
              />
            </div>

            <div className="lg:col-span-2 flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                loading={isCreating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full lg:w-auto"
              >
                Add Transaction
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Transactions Table */}
      <Card className="shadow-lg border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-white">Recent Transactions</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-xs lg:text-sm text-white/80">Last 30 days</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" className="text-blue-600" />
            <span className="ml-3 text-white/80">Loading transactions...</span>
          </div>
        ) : (
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <table className="min-w-full divide-y divide-white/20 text-sm lg:text-base">
            <thead className="bg-black/20">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider hidden md:table-cell">
                  Comment
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-white/10">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-white">
                    <div className="lg:hidden">{new Date(transaction.date || transaction.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="hidden lg:block">{new Date(transaction.date || transaction.transactionDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm font-medium text-white">
                    <div className="truncate max-w-[120px] lg:max-w-none">{transaction.name}</div>
                    <div className="sm:hidden text-xs text-white/60 mt-1">
                      <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${
                        transaction.type === 'income'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-white">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-white/80 max-w-xs truncate hidden md:table-cell">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-white/60" />
                      <span>{transaction.comment}</span>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-white">
                    {deletableTransactions.has(transaction.id) ? (
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1 rounded hover:bg-red-500/20"
                        title="Delete transaction (available for 5 minutes)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-white/30 text-xs">
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-lg font-medium text-white">No transactions yet</h3>
              <p className="text-white/80">Add your first transaction to get started</p>
            </div>
          )}
        </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;