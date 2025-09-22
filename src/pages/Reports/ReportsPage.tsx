import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from "recharts";
import { useTransactions } from "../../hooks/useTransactions";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AnimatedCounter from "../../components/UI/AnimatedCounter";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Award, AlertTriangle } from "lucide-react";

const ReportsPage: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: tomorrow.toISOString().split("T")[0],
  });

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Helper to parse transaction date
  const getTransactionDate = (t: any) => {
    const dateValue = t.createdAt || t.date;
    if (!dateValue) return null;
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? null : d;
  };

  const start = new Date(dateRange.startDate);
  const end = new Date(dateRange.endDate);
  end.setHours(23, 59, 59, 999);

  // Filtered transactions by date and department
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = getTransactionDate(t);
      if (!transactionDate) return false;

      const withinDate = transactionDate >= start && transactionDate <= end;
      const matchesDept = selectedDepartment
        ? t.department?.trim().toLowerCase() === selectedDepartment.toLowerCase()
        : true;

      return withinDate && matchesDept;
    });
  }, [transactions, start, end, selectedDepartment]);

  // Metrics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const highestIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce(
      (max, t) =>
        parseFloat(t.amount.toString()) > parseFloat(max.amount.toString())
          ? t
          : max,
      { amount: 0, name: "No income" },
    );

  const highestExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (max, t) =>
        parseFloat(t.amount.toString()) > parseFloat(max.amount.toString())
          ? t
          : max,
      { amount: 0, name: "No expenses" },
    );

  // Unique departments
  const departmentOptions = useMemo(() => {
    const depts = Array.from(
      new Set(
        transactions
          .map((t) => t.department?.trim().toLowerCase())
          .filter(Boolean)
      )
    );
    return depts.map((d) => ({
      value: d,
      label: d.charAt(0).toUpperCase() + d.slice(1),
    }));
  }, [transactions]);

  // Year for charts
  const years = Array.from(
    new Set(
      filteredTransactions
        .map((t) => getTransactionDate(t)?.getFullYear())
        .filter((y) => y !== undefined && y !== null)
    )
  );
  const currentYear = years.length ? Math.max(...years) : new Date().getFullYear();

  // Monthly data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1).toLocaleString("default", { month: "short" });
    const monthTransactions = filteredTransactions.filter((t) => {
      const d = getTransactionDate(t);
      return d && d.getMonth() === i && d.getFullYear() === currentYear;
    });
    const income = monthTransactions.filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    const expenses = monthTransactions.filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    return { month, income, expenses, profit: income - expenses };
  });

  const pieData = [
    { name: "Income", value: totalIncome, color: "#10B981" },
    { name: "Expenses", value: totalExpenses, color: "#EF4444" },
  ].filter(d => d.value > 0);

  const COLORS = ["#10B981", "#EF4444"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Financial Reports</h1>
        <p className="text-emerald-100 text-lg">
          Analyze your financial performance with detailed insights
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-gray-500 text-black flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center space-x-1">
       
          <Input
            label="Start"
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange(prev => ({ ...prev, startDate: e.target.value }))
            }
          />
          <Input
            label="End "
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange(prev => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Select
            options={[{ value: "", label: "All Departments" }, ...departmentOptions]}
            value={
              selectedDepartment
                ? { value: selectedDepartment, label: selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1) }
                : { value: "", label: "All Departments" }
            }
            onChange={(option) => setSelectedDepartment(option?.value || null)}
            placeholder="Filter by department"
            className="w-48"
          />

          <button
            onClick={() => setSelectedDepartment(null)}
            className="px-3 py-1 bg-black/20 text-white rounded hover:bg-black/30"
          >
            Clear Filter
          </button>
        </div>
      </Card>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-emerald-600" />
          <span className="ml-3 text-black">Loading financial data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Income</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter value={totalIncome} useCurrency />
                </p>
              </div>
              <div className="w-12 h-12 bg-green-400/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-100" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Total Expenses</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter value={totalExpenses} useCurrency />
                </p>
              </div>
              <div className="w-12 h-12 bg-red-400/30 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-100" />
              </div>
            </div>
          </Card>

          <Card className={`bg-gradient-to-br ${netProfit >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={netProfit >= 0 ? "text-blue-100" : "text-orange-100"}>Net Profit</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter value={netProfit} useCurrency />
                </p>
              </div>
              <div className={`w-12 h-12 ${netProfit >= 0 ? "bg-blue-400/30" : "bg-orange-400/30"} rounded-full flex items-center justify-center`}>
                <DollarSign className={`w-6 h-6 ${netProfit >= 0 ? "text-blue-100" : "text-orange-100"}`} />
              </div>
            </div>
          </Card>

          <Card className={`bg-gradient-to-br ${profitMargin >= 0 ? "from-purple-500 to-purple-600" : "from-gray-500 to-gray-600"} text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={profitMargin >= 0 ? "text-purple-100" : "text-gray-100"}>Profit Margin</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter value={Math.round(profitMargin * 10) / 10} suffix="%" />
                </p>
              </div>
              <div className={`w-12 h-12 ${profitMargin >= 0 ? "bg-purple-400/30" : "bg-gray-400/30"} rounded-full flex items-center justify-center`}>
                <TrendingUp className={`w-6 h-6 ${profitMargin >= 0 ? "text-purple-100" : "text-gray-100"}`} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-black">
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Income vs Expenses ({currentYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="shadow-lg border-0 bg-black">
            <h3 className="text-lg font-semibold text-white mb-4">
              Profit Trend ({currentYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
