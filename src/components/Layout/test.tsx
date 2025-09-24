import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useTransactions } from "../../hooks/useTransactions";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AnimatedCounter from "../../components/UI/AnimatedCounter";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const ReportsPage: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  // State
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Default date range
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: tomorrow.toISOString().split("T")[0],
  });

  // Helpers
  const getTransactionDate = (t: any) => {
    const d = new Date(t.createdAt || t.date);
    return isNaN(d.getTime()) ? null : d;
  };

  const start = new Date(dateRange.startDate);
  const end = new Date(dateRange.endDate);
  end.setHours(23, 59, 59, 999);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = getTransactionDate(t);
      if (!d) return false;

      const withinRange = d >= start && d <= end;
      const matchesDept = selectedDepartment
        ? t.department?.trim().toLowerCase() ===
          selectedDepartment.toLowerCase()
        : true;

      return withinRange && matchesDept;
    });
  }, [transactions, start, end, selectedDepartment]);

  // Metrics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome
    ? (netProfit / totalIncome) * 100
    : 0;

  // Departments
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

  // Current year
  const years = Array.from(
    new Set(
      filteredTransactions
        .map((t) => getTransactionDate(t)?.getFullYear())
        .filter(Boolean)
    )
  );
  const currentYear =
    years.length > 0 ? Math.max(...(years as number[])) : new Date().getFullYear();

  // Monthly summary
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1).toLocaleString("default", {
      month: "short",
    });
    const monthTx = filteredTransactions.filter((t) => {
      const d = getTransactionDate(t);
      return d && d.getFullYear() === currentYear && d.getMonth() === i;
    });

    const income = monthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = monthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    return { month, income, expenses, profit: income - expenses, monthIndex: i };
  });

  // Daily breakdown for selected month
  const dailyData = useMemo(() => {
    if (selectedMonth === null) return [];
    const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const dayTx = filteredTransactions.filter((t) => {
        const d = getTransactionDate(t);
        return (
          d &&
          d.getFullYear() === currentYear &&
          d.getMonth() === selectedMonth &&
          d.getDate() === dayIndex + 1
        );
      });

      const income = dayTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const expenses = dayTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);

      return { day: dayIndex + 1, income, expenses, profit: income - expenses };
    });
  }, [filteredTransactions, selectedMonth, currentYear]);

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
        {/* Date range */}
        <div className="flex items-center space-x-1">
          <Input
            label="Start"
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <Input
            label="End"
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>

        {/* Department filter */}
        <div className="flex items-center space-x-2">
          <Select
            options={[{ value: "", label: "All Departments" }, ...departmentOptions]}
            value={
              selectedDepartment
                ? {
                    value: selectedDepartment,
                    label:
                      selectedDepartment.charAt(0).toUpperCase() +
                      selectedDepartment.slice(1),
                  }
                : { value: "", label: "All Departments" }
            }
            onChange={(opt) => setSelectedDepartment(opt?.value || null)}
            className="w-48"
          />
          <button
            onClick={() => setSelectedDepartment(null)}
            className="px-3 py-1 bg-black/20 text-white rounded hover:bg-black/30"
          >
            Clear
          </button>
        </div>
      </Card>

      {/* Summary */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-emerald-600" />
          <span className="ml-3 text-black">Loading financial data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Income */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <p className="text-green-100">Total Income</p>
            <p className="text-3xl font-bold">
              <AnimatedCounter value={totalIncome} useCurrency />
            </p>
            <TrendingUp className="w-6 h-6 mt-2 text-green-100" />
          </Card>

          {/* Expenses */}
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
            <p className="text-red-100">Total Expenses</p>
            <p className="text-3xl font-bold">
              <AnimatedCounter value={totalExpenses} useCurrency />
            </p>
            <TrendingDown className="w-6 h-6 mt-2 text-red-100" />
          </Card>

          {/* Net Profit */}
          <Card
            className={`bg-gradient-to-br ${
              netProfit >= 0
                ? "from-blue-500 to-blue-600"
                : "from-orange-500 to-orange-600"
            } text-white shadow-lg`}
          >
            <p>Net Profit</p>
            <p className="text-3xl font-bold">
              <AnimatedCounter value={netProfit} useCurrency />
            </p>
            <DollarSign className="w-6 h-6 mt-2" />
          </Card>

          {/* Profit Margin */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <p>Profit Margin</p>
            <p className="text-3xl font-bold">
              <AnimatedCounter
                value={Math.round(profitMargin * 10) / 10}
                suffix="%"
              />
            </p>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly */}
          <Card className="shadow-lg border-0 bg-black">
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Income vs Expenses ({currentYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                onClick={(d) =>
                  setSelectedMonth((d.activePayload?.[0]?.payload?.monthIndex ?? null))
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => Number(v).toLocaleString()} />
                <Bar dataKey="income" fill="#10B981" />
                <Bar dataKey="expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Profit Trend */}
          <Card className="shadow-lg border-0 bg-black">
            <h3 className="text-lg font-semibold text-white mb-4">
              Profit Trend ({currentYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => Number(v).toLocaleString()} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Daily breakdown */}
      {selectedMonth !== null && dailyData.length > 0 && (
        <Card className="shadow-lg border-0 bg-black">
          <h3 className="text-lg font-semibold text-white mb-4">
            Daily Income vs Expenses (
            {new Date(currentYear, selectedMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="income" fill="#10B981" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
