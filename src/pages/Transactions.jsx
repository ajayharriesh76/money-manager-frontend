import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionHistory from '../components/TransactionHistory';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTransaction(null);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    handleCloseModal();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">View and manage all your transactions</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Transaction History */}
      <TransactionHistory 
        onEdit={handleEdit} 
        refreshTrigger={refreshTrigger}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editTransaction={editTransaction}
      />
    </div>
  );
};

export default Transactions;
