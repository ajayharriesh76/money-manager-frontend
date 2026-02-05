import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  Filter, 
  Calendar,
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import { transactionAPI } from '../services/api';
import { formatCurrency, formatDateTime, CATEGORIES, DIVISIONS } from '../utils/helpers';
import { toast } from 'react-toastify';

const TransactionHistory = ({ onEdit, refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.division) {
      filtered = filtered.filter(t => t.division === filters.division);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(t => {
        const transDate = new Date(t.transactionDate);
        return transDate >= new Date(filters.startDate) && 
               transDate <= new Date(filters.endDate);
      });
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      division: '',
      category: '',
      startDate: '',
      endDate: '',
      searchTerm: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const allCategories = [...new Set(transactions.map(t => t.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${
              hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in-up">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>

            <select
              value={filters.division}
              onChange={(e) => setFilters({ ...filters, division: e.target.value })}
              className="input-field"
            >
              <option value="">All Divisions</option>
              {DIVISIONS.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input-field flex-1"
                placeholder="Start date"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-field flex-1"
                placeholder="End date"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="btn-secondary flex items-center gap-2 justify-center"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6 font-display">
          Transaction History
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredTransactions.length} transactions)
          </span>
        </h3>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
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
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">
                        {transaction.category || 'Transfer'}
                      </p>
                      {transaction.division && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.division === 'OFFICE' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {transaction.division}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{transaction.description}</p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(transaction.transactionDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.fromAccount && (
                      <p className="text-xs text-gray-500">
                        From: {transaction.fromAccount}
                      </p>
                    )}
                    {transaction.toAccount && (
                      <p className="text-xs text-gray-500">
                        To: {transaction.toAccount}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {transaction.isEditable && (
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {transaction.isEditable && (
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
