import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useTransactions } from "../../hooks/useTransactions";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AnimatedCounter from "../../components/UI/AnimatedCounter";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle,
} from "lucide-react";

const ReportsPage: React.FC = () => {
  const { transactions, isLoading } = useTransactions();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: tomorrow.toISOString().split("T")[0],
  });

  // Helper: get valid date from transaction
  const getTransactionDate = (t: any) => {
    const dateValue = t.createdAt || t.date;
    if (!dateValue) return null;
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? null : d;
  };

const start = new Date(dateRange.startDate);
const end = new Date(dateRange.endDate);
end.setHours(23, 59, 59, 999); // include the whole day
  console.log("Selected date range:", start, end);

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = getTransactionDate(t);
    if (!transactionDate) return false;

    return transactionDate >= start && transactionDate <= end;
  });
  console.log(
    "Filtering transactions from",
    start,
    "to",
    end,
    "this is the filtered transactions:",
    filteredTransactions,
  );

  // Metrics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Highest income and expense
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

  // Year range
  const years = Array.from(
    new Set(
      filteredTransactions
        .map((t) => {
          const d = getTransactionDate(t);
          return d ? d.getFullYear() : null;
        })
        .filter((y) => y !== null),
    ),
  );

  const currentYear =
    years.length > 0 ? Math.max(...years) : new Date().getFullYear();

  // Monthly chart data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1).toLocaleString("default", {
      month: "short",
    });

    const monthlyTransactions = filteredTransactions.filter((t) => {
      const d = getTransactionDate(t);
      return d && d.getMonth() === i && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return { month, income, expenses, profit: income - expenses };
  });

  const pieData = [
    { name: "Income", value: totalIncome, color: "#10B981" },
    { name: "Expenses", value: totalExpenses, color: "#EF4444" },
  ].filter((item) => item.value > 0);

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

      {/* Date Range Filter */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-gray-500 text-black">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-black" />
          <Input
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <Input
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
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
          {/* Total Income */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

          {/* Total Expenses */}
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

          {/* Net Profit */}
          <Card
            className={`bg-gradient-to-br ${netProfit >= 0 ? "from-blue-500 to-blue-600" : "from-orange-500 to-orange-600"} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={
                    netProfit >= 0 ? "text-blue-100" : "text-orange-100"
                  }
                >
                  Net Profit
                </p>
                <p className="text-3xl font-bold">
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

          {/* Profit Margin */}
          <Card
            className={`bg-gradient-to-br ${profitMargin >= 0 ? "from-purple-500 to-purple-600" : "from-gray-500 to-gray-600"} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={
                    profitMargin >= 0 ? "text-purple-100" : "text-gray-100"
                  }
                >
                  Profit Margin
                </p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter
                    value={Math.round(profitMargin * 10) / 10}
                    suffix="%"
                  />
                </p>
              </div>
              <div
                className={`w-12 h-12 ${profitMargin >= 0 ? "bg-purple-400/30" : "bg-gray-400/30"} rounded-full flex items-center justify-center`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${profitMargin >= 0 ? "text-purple-100" : "text-gray-100"}`}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Highlights */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Highest Income
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {parseFloat(highestIncome.amount.toString()).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{highestIncome.name}</p>
              </div>
            </div>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Highest Expense
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {parseFloat(
                    highestExpense.amount.toString(),
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{highestExpense.name}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Bar Chart */}
            <Card className="shadow-lg border-0 bg-black">
              <h3 className="text-lg font-semibold text-white mb-4">
                Monthly Income vs Expenses ({currentYear})
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()}`,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Bar dataKey="income" fill="#10B981" name="income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-lg border-0 backdrop:blur-sm bg-black">
              <h3 className="text-lg font-semibold text-white mb-4">
                Income vs Expenses Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Profit Trend Line Chart */}
          <Card className="shadow-lg border-0 bg-black">
            <h3 className="text-lg font-semibold text-white mb-4">
              Profit Trend ({currentYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${Number(value).toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
