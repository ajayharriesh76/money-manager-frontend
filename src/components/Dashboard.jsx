import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  Filter,
  ChevronDown 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { transactionAPI } from '../services/api';
import { formatCurrency, getMonthDateRange, getWeekDateRange, getYearDateRange } from '../utils/helpers';
import { toast } from 'react-toastify';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

const Dashboard = () => {
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let dateRange;
      if (period === 'week') {
        dateRange = getWeekDateRange();
      } else if (period === 'month') {
        dateRange = getMonthDateRange();
      } else {
        dateRange = getYearDateRange();
      }

      const response = await transactionAPI.getDashboard(
        dateRange.startDate,
        dateRange.endDate
      );
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!summary) return null;

  const categoryExpenseData = Object.entries(summary.categoryWiseExpense || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const categoryIncomeData = Object.entries(summary.categoryWiseIncome || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex justify-end">
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-6 py-3 pr-10 font-medium text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(summary.totalIncome || 0)}
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Total Expense</p>
              <p className="text-3xl font-bold text-red-700">
                {formatCurrency(summary.totalExpense || 0)}
              </p>
            </div>
            <div className="p-4 bg-red-100 rounded-2xl">
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Balance</p>
              <p className={`text-3xl font-bold ${
                summary.balance >= 0 ? 'text-blue-700' : 'text-red-700'
              }`}>
                {formatCurrency(summary.balance || 0)}
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-2xl">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        {categoryExpenseData.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6 font-display">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Income by Category */}
        {categoryIncomeData.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6 font-display">Income by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryIncomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {summary.recentTransactions && summary.recentTransactions.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6 font-display">Recent Transactions</h3>
          <div className="space-y-3">
            {summary.recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-100 text-green-600' 
                      : transaction.type === 'EXPENSE'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {transaction.type === 'INCOME' && '💰'}
                    {transaction.type === 'EXPENSE' && '💸'}
                    {transaction.type === 'TRANSFER' && '🔄'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.category || 'Transfer'}</p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
