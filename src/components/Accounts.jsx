import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Wallet, CreditCard, Banknote, DollarSign } from 'lucide-react';
import { accountAPI } from '../services/api';
import { formatCurrency, ACCOUNT_TYPES } from '../utils/helpers';
import { toast } from 'react-toastify';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    initialBalance: '',
    accountType: 'CASH',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountAPI.create(
        formData.accountName,
        parseFloat(formData.initialBalance),
        formData.accountType
      );
      toast.success('Account created successfully!');
      setShowAddModal(false);
      setFormData({ accountName: '', initialBalance: '', accountType: 'CASH' });
      fetchAccounts();
    } catch (error) {
      toast.error('Failed to create account');
      console.error('Failed to create account:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.delete(id);
        toast.success('Account deleted successfully');
        fetchAccounts();
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'CASH':
        return <Banknote className="w-6 h-6" />;
      case 'BANK':
        return <Wallet className="w-6 h-6" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-6 h-6" />;
      case 'WALLET':
        return <DollarSign className="w-6 h-6" />;
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Accounts
          </h2>
          <p className="text-gray-600 mt-1">Manage your financial accounts</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="card bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Total Balance</p>
            <p className="text-4xl font-bold">{formatCurrency(getTotalBalance())}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
            <Wallet className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="card group hover:scale-105 transition-transform duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                account.accountType === 'CASH' ? 'bg-green-100 text-green-600' :
                account.accountType === 'BANK' ? 'bg-blue-100 text-blue-600' :
                account.accountType === 'CREDIT_CARD' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {getAccountIcon(account.accountType)}
              </div>
              <button
                onClick={() => handleDelete(account.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-1">{account.accountName}</h3>
            <p className="text-xs text-gray-500 mb-3">
              {account.accountType.replace('_', ' ')}
            </p>
            
            <div className="pt-3 border-t border-gray-100">
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(account.balance)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No accounts yet</p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Your First Account
          </button>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-bold font-display mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Add New Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Main Savings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCOUNT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: type })}
                        className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          formData.accountType === type
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
