import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home as HomeIcon, List, Wallet, BarChart3 } from 'lucide-react';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import AccountsPage from './pages/AccountsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">₹</span>
                </div>
                <span className="text-xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Money Manager
                </span>
              </div>
              
              <div className="flex gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <HomeIcon className="w-5 h-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </NavLink>
                
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <List className="w-5 h-5" />
                  <span className="hidden md:inline">Transactions</span>
                </NavLink>
                
                <NavLink
                  to="/accounts"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <Wallet className="w-5 h-5" />
                  <span className="hidden md:inline">Accounts</span>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<AccountsPage />} />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
