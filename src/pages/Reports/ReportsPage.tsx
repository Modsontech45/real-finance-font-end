import React, { useState, useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";

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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Filter,
  Download,
  Eye,
} from "lucide-react";

// Mock components
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-100 rounded-lg p-6 shadow-md ${className}`}>{children}</div>
);

const Input = ({ label, type, value, onChange, className = "" }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
    />
  </div>
);

const Select = ({ options, value, onChange, className = "" }) => (
  <select
    value={value?.value || ""}
    onChange={(e) => onChange(options.find(opt => opt.value === e.target.value))}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const LoadingSpinner = ({ size = "md", className = "" }) => (
  <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600 ${size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'} ${className}`}></div>
);

const AnimatedCounter = ({ value, useCurrency = false, suffix = "" }) => (
  <span>
    {useCurrency && "CFA"}
    {typeof value === 'number' ? value.toLocaleString() : value}
    {suffix}
  </span>
);

const ReportsPage = () => {
  const { transactions, isLoading } = useTransactions();

  // State management
  const [viewMode, setViewMode] = useState("monthly"); // daily, monthly, yearly, department
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Date range state
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: today.toISOString().split("T")[0],
  });

  // Helper functions
  const getTransactionDate = (transaction) => {
    const date = new Date(transaction.transactionDate || transaction.date);
    console.log(transaction, date);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatCurrency = (amount) => `CFA ${Number(amount).toLocaleString()}`;

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return transactions.filter((transaction) => {
      const date = getTransactionDate(transaction);
      if (!date) return false;

      const withinRange = date >= start && date <= end;
      const matchesDepartment = selectedDepartment
        ? transaction.department?.toLowerCase() === selectedDepartment.toLowerCase()
        : true;
      const matchesYear = date.getFullYear() === selectedYear;

      return withinRange && matchesDepartment && matchesYear;
    });
  }, [transactions, dateRange, selectedDepartment, selectedYear]);

  // Calculate key metrics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome ? (netProfit / totalIncome) * 100 : 0;

  // Get unique departments
  const departmentOptions = useMemo(() => {
    const departments = Array.from(
      new Set(
        transactions
          .map((t) => t.department?.trim())
          .filter(Boolean)
      )
    );
    return departments.map((dept) => ({
      value: dept,
      label: dept.charAt(0).toUpperCase() + dept.slice(1),
    }));
  }, [transactions]);

  // Get available years
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        transactions
          .map((t) => getTransactionDate(t)?.getFullYear())
          .filter(Boolean)
      )
    );
    return years.sort((a, b) => b - a);
  }, [transactions]);

  // Generate data based on view mode
  const generateChartData = () => {
    switch (viewMode) {
      case "daily":
        return generateDailyData();
      case "monthly":
        return generateMonthlyData();
      case "yearly":
        return generateYearlyData();
      case "department":
        return generateDepartmentData();
      default:
        return generateMonthlyData();
    }
  };

  const generateDailyData = () => {
    if (selectedMonth === null) return [];
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const dayTransactions = filteredTransactions.filter((t) => {
        const date = getTransactionDate(t);
        return date && date.getMonth() === selectedMonth && date.getDate() === day;
      });

      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        period: day.toString(),
        income,
        expenses,
        profit: income - expenses,
        transactions: dayTransactions.length,
      };
    });
  };

  const generateMonthlyData = () => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthName = new Date(selectedYear, monthIndex).toLocaleString("default", {
        month: "short",
      });
      
      const monthTransactions = filteredTransactions.filter((t) => {
        const date = getTransactionDate(t);
        return date && date.getMonth() === monthIndex;
      });
      console.log(monthTransactions);
      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        period: monthName,
        income,
        expenses,
        profit: income - expenses,
        transactions: monthTransactions.length,
        monthIndex,
      };
    });
  };

  const generateYearlyData = () => {
    const yearlyData = {};
    
    availableYears.forEach((year) => {
      const yearTransactions = transactions.filter((t) => {
        const date = getTransactionDate(t);
        return date && date.getFullYear() === year;
      });

      const income = yearTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = yearTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      yearlyData[year] = {
        period: year.toString(),
        income,
        expenses,
        profit: income - expenses,
        transactions: yearTransactions.length,
      };
    });

    return Object.values(yearlyData);
  };

  const generateDepartmentData = () => {
    const departmentData = {};
    
    departmentOptions.forEach((dept) => {
      const deptTransactions = filteredTransactions.filter((t) => 
        t.department?.toLowerCase() === dept.value.toLowerCase()
      );

      const income = deptTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = deptTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      departmentData[dept.value] = {
        period: dept.label,
        income,
        expenses,
        profit: income - expenses,
        transactions: deptTransactions.length,
      };
    });

    return Object.values(departmentData);
  };

  const chartData = generateChartData();

  // Department breakdown for pie chart
  const departmentBreakdown = departmentOptions.map((dept) => {
    const amount = filteredTransactions
      .filter((t) => t.department?.toLowerCase() === dept.value.toLowerCase())
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      name: dept.label,
      value: amount,
    };
  }).filter((item) => item.value > 0);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div className="min-h-screen bg-blue p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Financial Reports Dashboard</h1>
            <p className="text-emerald-100 text-lg">
              Comprehensive analysis of your financial performance with detailed insights
            </p>
          </div>
          {/* <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>
          </div> */}
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-emerald-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <Select
              options={[{ value: "", label: "All Departments" }, ...departmentOptions]}
              value={
                selectedDepartment
                  ? departmentOptions.find(d => d.value === selectedDepartment)
                  : { value: "", label: "All Departments" }
              }
              onChange={(opt) => setSelectedDepartment(opt?.value || null)}
            />
            <Select
              options={availableYears.map(year => ({ value: year.toString(), label: year.toString() }))}
              value={{ value: selectedYear.toString(), label: selectedYear.toString() }}
              onChange={(opt) => setSelectedYear(Number(opt?.value))}
            />
          </div>
        </Card>

        <Card className="shadow-lg border-0">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
            <h3 className="text-lg font-semibold">View Mode</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "daily", label: "Daily", icon: Calendar },
              { key: "monthly", label: "Monthly", icon: Calendar },
              { key: "yearly", label: "Yearly", icon: TrendingUp },
              { key: "department", label: "Department", icon: Building2 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                  viewMode === key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>

          {viewMode === "daily" && (
            <div className="mt-4">
              <Select
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: i.toString(),
                  label: new Date(selectedYear, i).toLocaleString("default", { month: "long" })
                }))}
                value={selectedMonth !== null ? {
                  value: selectedMonth.toString(),
                  label: new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" })
                } : null}
                onChange={(opt) => setSelectedMonth(opt ? Number(opt.value) : null)}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Key Metrics */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-emerald-600" />
          <span className="ml-3 text-gray-600">Loading financial data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold mt-1">
                  <AnimatedCounter value={totalIncome} useCurrency />
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold mt-1">
                  <AnimatedCounter value={totalExpenses} useCurrency />
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-100" />
            </div>
          </Card>

          <Card
            className={`bg-gradient-to-br ${
              netProfit >= 0
                ? "from-blue-500 to-blue-600"
                : "from-orange-500 to-orange-600"
            } text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Net Profit</p>
                <p className="text-3xl font-bold mt-1">
                  <AnimatedCounter value={netProfit} useCurrency />
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-white/80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Profit Margin</p>
                <p className="text-3xl font-bold mt-1">
                  <AnimatedCounter
                    value={Math.round(profitMargin * 10) / 10}
                    suffix="%"
                  />
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-100" />
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Overview
                  {viewMode === "daily" && selectedMonth !== null && 
                    ` - ${new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" })} ${selectedYear}`
                  }
                  {viewMode === "monthly" && ` - ${selectedYear}`}
                </h3>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  onClick={(data) => {
                    if (viewMode === "monthly" && data.activePayload?.[0]?.payload?.monthIndex !== undefined) {
                      setSelectedMonth(data.activePayload[0].payload.monthIndex);
                      setViewMode("daily");
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `CFA${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Profit']}
                    labelFormatter={(label) => `Period: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="income" fill="#10B981" name="income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#EF4444" name="expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Department Breakdown */}
          <Card className="shadow-lg border-0">
            <h3 className="text-lg font-semibold mb-6">Department Breakdown</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {departmentBreakdown.map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{dept.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(dept.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Profit Trend Chart */}
      {!isLoading && viewMode !== "department" && (
        <Card className="shadow-lg border-0">
          <h3 className="text-lg font-semibold mb-6">
            Profit Trend - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `CFA${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), "Profit"]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Transaction Summary Table */}
      <Card className="shadow-lg border-0">
        <h3 className="text-lg font-semibold mb-6">Transaction Summary</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Income</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Expenses</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Profit</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.period}</td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">
                    {formatCurrency(row.income)}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600 font-medium">
                    {formatCurrency(row.expenses)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    row.profit >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}>
                    {formatCurrency(row.profit)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {row.transactions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;