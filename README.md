# Money Manager Frontend

Modern React-based web application for managing personal finances.

## Tech Stack

- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Date Utilities**: date-fns

## Features

### Dashboard
- 📊 Visual summary of income and expenses
- 📈 Category-wise expense pie chart
- 📉 Income breakdown bar chart
- 💰 Total balance display
- 📅 Period filters (Weekly/Monthly/Yearly)
- 🔄 Recent transaction history

### Transaction Management
- ➕ Add new transactions (Income/Expense/Transfer)
- ✏️ Edit transactions (within 12 hours)
- 🗑️ Delete transactions (within 12 hours)
- 🔍 Advanced search and filtering
- 📋 Complete transaction history
- 🏷️ Category and division tracking
- 📅 Date and time tracking

### Account Management
- 💳 Create multiple accounts
- 💰 Track balances across accounts
- 🏦 Support for different account types (Cash, Bank, Credit Card, Wallet)
- 📊 Total balance overview
- ⚡ Automatic balance updates

### Filtering & Search
- 🔍 Search by description or category
- 📅 Date range filtering
- 🏷️ Filter by category
- 💼 Filter by division (Office/Personal)
- 💸 Filter by transaction type

## Project Structure

```
src/
├── components/           # Reusable UI Components
│   ├── Dashboard.jsx    # Dashboard with charts
│   ├── TransactionModal.jsx  # Add/Edit transaction modal
│   ├── TransactionHistory.jsx # Transaction list with filters
│   └── Accounts.jsx     # Account management
├── pages/               # Page Components
│   ├── Home.jsx        # Home page with dashboard
│   ├── Transactions.jsx # Transactions page
│   └── AccountsPage.jsx # Accounts page
├── services/           # API Services
│   └── api.js          # API configuration and endpoints
├── utils/              # Utility Functions
│   └── helpers.js      # Helper functions and constants
├── App.jsx            # Main app component with routing
├── main.jsx           # Entry point
└── index.css          # Global styles and Tailwind config
```

## Design Features

### Modern UI/UX
- 🎨 Beautiful gradient backgrounds
- 🌟 Smooth animations and transitions
- 💎 Glass-morphism effects
- 🎯 Intuitive navigation
- 📱 Fully responsive design
- ⚡ Fast and performant

### Color Scheme
- Primary: Blue to Indigo gradient
- Income: Green tones
- Expense: Red tones
- Neutral: Gray scale

### Typography
- Display Font: Outfit
- Body Font: Inter

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd money-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API endpoint in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';  // Update if needed
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

1. Create production build:
```bash
npm run build
```

2. Preview production build:
```bash
npm run preview
```

The build output will be in the `dist/` directory.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Update `src/services/api.js` to use environment variables:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## Key Components

### TransactionModal
- Multi-tab interface (Income/Expense/Transfer)
- Dynamic category selection
- Division toggle (Office/Personal)
- Account selection
- Date-time picker
- Form validation

### Dashboard
- Period selector (Week/Month/Year)
- Summary cards (Income/Expense/Balance)
- Pie chart for expense categories
- Bar chart for income categories
- Recent transactions list

### TransactionHistory
- Search functionality
- Advanced filters
- Edit/Delete actions (time-restricted)
- Responsive design
- Empty state handling

### Accounts
- Account creation modal
- Account type selection
- Balance display
- Total balance calculation
- Delete functionality

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify

## Features Overview

### ✅ Implemented Features

1. **Dashboard with Period Filters**
   - Monthly, Weekly, Yearly views
   - Visual charts and graphs
   - Summary statistics

2. **Transaction Management**
   - Add Income/Expense/Transfer
   - Edit within 12 hours
   - Delete within 12 hours
   - Category tracking
   - Division tracking (Office/Personal)

3. **Account Management**
   - Multiple account support
   - Different account types
   - Balance tracking
   - Transaction linking

4. **Filtering & Search**
   - Date range filtering
   - Category filtering
   - Division filtering
   - Type filtering
   - Search functionality

5. **Modern UI**
   - Responsive design
   - Smooth animations
   - Toast notifications
   - Modal dialogs
   - Loading states

## API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in `src/services/api.js`.

### Transaction APIs
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/dashboard` - Get dashboard data
- `GET /api/transactions/date-range` - Filter by date range

### Account APIs
- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get all accounts
- `DELETE /api/accounts/:id` - Delete account

## Contributing

This is a hackathon project and is not open for contributions.

## License

Developed as part of a hackathon assessment task.
