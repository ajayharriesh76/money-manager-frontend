import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import TransactionModal from '../components/TransactionModal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Money Manager
          </h1>
          <p className="text-gray-600 text-lg">Track your finances with ease</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
        >
          <Plus className="w-6 h-6" />
          Add Transaction
        </button>
      </div>

      {/* Dashboard */}
      <Dashboard key={refreshTrigger} />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default Home;
