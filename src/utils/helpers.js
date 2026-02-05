import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const getMonthDateRange = (date = new Date()) => {
  return {
    startDate: startOfMonth(date).toISOString(),
    endDate: endOfMonth(date).toISOString(),
  };
};

export const getWeekDateRange = (date = new Date()) => {
  return {
    startDate: startOfWeek(date).toISOString(),
    endDate: endOfWeek(date).toISOString(),
  };
};

export const getYearDateRange = (date = new Date()) => {
  return {
    startDate: startOfYear(date).toISOString(),
    endDate: endOfYear(date).toISOString(),
  };
};

export const CATEGORIES = {
  EXPENSE: [
    'Fuel',
    'Food',
    'Movie',
    'Shopping',
    'Medical',
    'Loan',
    'Transport',
    'Utilities',
    'Entertainment',
    'Education',
    'Rent',
    'Other'
  ],
  INCOME: [
    'Salary',
    'Business',
    'Investment',
    'Freelance',
    'Gift',
    'Other'
  ]
};

export const DIVISIONS = ['OFFICE', 'PERSONAL'];

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE', 'TRANSFER'];

export const ACCOUNT_TYPES = ['CASH', 'BANK', 'CREDIT_CARD', 'WALLET'];
