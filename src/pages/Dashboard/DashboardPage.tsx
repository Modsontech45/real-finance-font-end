// ✅ DashboardPage.tsx
import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TransactionFormData, UserRole } from "../../types";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../contexts/AuthContext";

import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Card from "../../components/UI/Card";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AnimatedCounter from "../../components/UI/AnimatedCounter";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "../../utils/currencies";

const schema = yup.object({
  date: yup.string().required("Date is required"),
  name: yup.string().required("Name is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  type: yup.string().oneOf(["income", "expense"]).required("Type is required"),
  comment: yup.string().required("Comment is required"),
  department: yup.string().required("Department is required"),
});

const DashboardPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    transactions,
    isLoading,
    isCreating,
    createTransaction,
    deleteTransaction,
    refetch,
  } = useTransactions();
  const { user } = useAuth();

  const isAdmin = useMemo(
    () => user?.roles?.includes(UserRole.SUPER_ADMIN),
    [user?.roles]
  );
  const isManager = useMemo(
    () => user?.roles?.includes(UserRole.MANAGER),
    [user?.roles]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "income",
      department: "",
    },
  });

  const departmentOptions =
    user?.company?.departments?.map((d, idx) => ({
      value: d,
      label: d.charAt(0).toUpperCase() + d.slice(1),
      key: `${d}-${idx}`,
    })) || [];

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // console.log("Submitting transaction:", data);
      await createTransaction(data);
      await refetch();
      reset();
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    await refetch();
  };

  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === "income") acc.totalIncome += amount;
      else if (t.type === "expense") acc.totalExpenses += amount;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 text-white pt-16 lg:pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-8 border border-white/20">
        <h1 className="text-2xl lg:text-4xl font-bold mb-2">
          Financial Dashboard
        </h1>
        <p className="text-white/80 text-sm lg:text-lg">
          Track your income and expenses in real-time
        </p>
        {(isAdmin || isManager) && (
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
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Income */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:-translate-y-1 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Income</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={totalIncome} useCurrency />
              </p>
            </div>
            <div className="w-12 h-12 bg-green-400/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-100" />
            </div>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:-translate-y-1 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Expenses</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={totalExpenses} useCurrency />
              </p>
            </div>
            <div className="w-12 h-12 bg-red-400/30 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-100" />
            </div>
          </div>
        </Card>

        {/* Net Profit */}
        <Card
          className={`bg-gradient-to-br ${netProfit >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} text-white shadow-lg hover:-translate-y-1 transition`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p>{netProfit >= 0 ? "Net Profit" : "Net Loss"}</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={netProfit} useCurrency />
              </p>
            </div>
            <div
              className={`w-12 h-12 ${netProfit >= 0 ? "bg-blue-400/30" : "bg-orange-400/30"} rounded-full flex items-center justify-center`}
            >
              <DollarSign
                className={`w-6 h-6 ${netProfit >= 0 ? "text-blue-100" : "text-orange-100"}`}
              />
            </div>
          </div>
        </Card>

        {/* Transactions Count */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:-translate-y-1 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Transactions</p>
              <p className="text-xl lg:text-3xl font-bold">
                <AnimatedCounter value={transactions.length} />
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-100" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="shadow-lg border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
          >
            <Input
              type="date"
              {...register("date")}
              error={errors.date?.message}
            />
            <Input
              label="Name"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Transaction name"
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              {...register("amount")}
              error={errors.amount?.message}
              placeholder="0.00"
            />
            <Select
              {...register("type")}
              error={errors.type?.message}
              options={typeOptions}
            />
            <Select
              label="Department"
              {...register("department")}
              error={errors.department?.message}
              options={departmentOptions}
            />

            <div className="lg:col-span-2">
              <Input
                label="Comment"
                {...register("comment")}
                error={errors.comment?.message}
                placeholder="Add a comment"
              />
            </div>

            {/* Department using Controller */}
            {/* <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select  {...register("department")} {...field} label="Department" options={departmentOptions} className="lg:col-span-2" error={errors.department?.message} />
              )}
            /> */}

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
          <h2 className="text-xl lg:text-2xl font-bold">Recent Transactions</h2>
          <span className="text-xs lg:text-sm text-white/80 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-white/60" /> Last 30 days
          </span>
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
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                    Date
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                    Name
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                    Amount
                  </th>
                  <th className="px-3 lg:px-6 py-3 hidden md:table-cell text-left text-xs font-medium text-white/70 uppercase">
                    Department
                  </th>
                  <th className="px-3 lg:px-6 py-3 hidden sm:table-cell text-left text-xs font-medium text-white/70 uppercase">
                    Type
                  </th>
                  <th className="px-3 lg:px-6 py-3 hidden md:table-cell text-left text-xs font-medium text-white/70 uppercase">
                    Comment
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm">
                      {new Date(t.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm font-medium">
                      {t.name}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm">
                      <span
                        className={`font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                      >
                        {/* change with currency format function */}
                        {formatCurrency(Number(t.amount))}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden capitalize md:table-cell text-xs lg:text-sm text-white/80">
                      {t.department}
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold uppercase rounded-full ${t.type === "income" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden md:table-cell text-xs lg:text-sm">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4 text-white/60" />
                        <span>{t.comment}</span>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm">
                      {t.isLocked ? (
                        <span className="text-white/30 text-xs">Locked</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/20"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                <h3 className="text-lg font-medium">No transactions yet</h3>
                <p className="text-white/80">
                  Add your first transaction to get started
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
