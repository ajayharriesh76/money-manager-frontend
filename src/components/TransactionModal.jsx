import React, { useState, useEffect } from 'react';
import { X, DollarSign, FileText, Tag, Briefcase, Calendar, ArrowLeftRight } from 'lucide-react';
import { transactionAPI, accountAPI } from '../services/api';
import { CATEGORIES, DIVISIONS } from '../utils/helpers';
import { toast } from 'react-toastify';

const TransactionModal = ({ isOpen, onClose, onSuccess, editTransaction }) => {
  const [activeTab, setActiveTab] = useState('INCOME');
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    type: 'INCOME',
    amount: '',
    category: '',
    division: 'PERSONAL',
    description: '',
    transactionDate: new Date().toISOString().slice(0, 16),
    fromAccount: '',
    toAccount: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
      if (editTransaction) {
        setFormData({
          ...editTransaction,
          transactionDate: new Date(editTransaction.transactionDate).toISOString().slice(0, 16),
        });
        setActiveTab(editTransaction.type);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editTransaction]);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'INCOME',
      amount: '',
      category: '',
      division: 'PERSONAL',
      description: '',
      transactionDate: new Date().toISOString().slice(0, 16),
      fromAccount: '',
      toAccount: '',
    });
    setActiveTab('INCOME');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab, category: 'Other' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        transactionDate: new Date(formData.transactionDate).toISOString(),
      };

      if (editTransaction) {
        await transactionAPI.update(editTransaction.id, dataToSubmit);
        toast.success('Transaction updated successfully!');
      } else {
        await transactionAPI.create(dataToSubmit);
        toast.success('Transaction created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save transaction');
      console.error('Failed to save transaction:', error);
    }
  };

  if (!isOpen) return null;

  const categories = activeTab === 'EXPENSE' ? CATEGORIES.EXPENSE : 
                     activeTab === 'INCOME' ? CATEGORIES.INCOME : [];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          {!editTransaction && (
            <div className="flex gap-2">
              {['INCOME', 'EXPENSE', 'TRANSFER'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'INCOME' && '💰 '}
                  {tab === 'EXPENSE' && '💸 '}
                  {tab === 'TRANSFER' && '🔄 '}
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              placeholder="Enter amount"
            />
          </div>

          {/* Category */}
          {activeTab !== 'TRANSFER' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Division */}
          {activeTab !== 'TRANSFER' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Division
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DIVISIONS.map((div) => (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setFormData({ ...formData, division: div })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.division === div
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {div === 'OFFICE' && '💼 '}
                    {div === 'PERSONAL' && '👤 '}
                    {div}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Accounts */}
          {activeTab === 'EXPENSE' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Account
              </label>
              <select
                value={formData.fromAccount}
                onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                className="input-field"
              >
                <option value="">Select account (optional)</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountName}>
                    {acc.accountName} - ₹{acc.balance}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'INCOME' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Account
              </label>
              <select
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                className="input-field"
              >
                <option value="">Select account (optional)</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountName}>
                    {acc.accountName} - ₹{acc.balance}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'TRANSFER' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Account
                </label>
                <select
                  required
                  value={formData.fromAccount}
                  onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.accountName}>
                      {acc.accountName} - ₹{acc.balance}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Account
                </label>
                <select
                  required
                  value={formData.toAccount}
                  onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.accountName}>
                      {acc.accountName} - ₹{acc.balance}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Enter description"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {editTransaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
