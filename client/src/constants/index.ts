// client/src/constants/index.ts
export const TRANSACTION_CATEGORIES = [
  'Groceries',
  'Restaurants',
  'Gas',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Rent',
  'Insurance',
  'Healthcare',
  'Travel',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other Income',
  'Transfer',
  'Payment',
  'Uncategorized'
] as const;

export const ACCOUNT_TYPES = [
  'checking',
  'savings', 
  'credit',
  'investment',
  'loan'
] as const;

export const TRANSACTION_TYPES = [
  'income',
  'expense', 
  'transfer',
  'payment',
  'refund',
  'fee'
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  'Groceries': 'hsl(120, 70%, 50%)',
  'Restaurants': 'hsl(30, 70%, 50%)',
  'Gas': 'hsl(200, 70%, 50%)',
  'Shopping': 'hsl(280, 70%, 50%)',
  'Entertainment': 'hsl(340, 70%, 50%)',
  'Utilities': 'hsl(60, 70%, 50%)',
  'Rent': 'hsl(180, 70%, 50%)',
  'Insurance': 'hsl(240, 70%, 50%)',
  'Healthcare': 'hsl(0, 70%, 50%)',
  'Travel': 'hsl(160, 70%, 50%)',
  'Education': 'hsl(220, 70%, 50%)',
  'Salary': 'hsl(120, 60%, 40%)',
  'Freelance': 'hsl(140, 60%, 40%)',
  'Investment': 'hsl(260, 60%, 40%)',
  'Other Income': 'hsl(100, 60%, 40%)',
  'Transfer': 'hsl(0, 0%, 50%)',
  'Payment': 'hsl(0, 0%, 40%)',
  'Uncategorized': 'hsl(0, 0%, 60%)'
};

export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions',
  ACCOUNTS: '/api/plaid/accounts',
  PLAID: {
    LINK_TOKEN: '/api/plaid/create_link_token',
    EXCHANGE_TOKEN: '/api/plaid/exchange_public_token',
    SYNC: '/api/plaid/sync_transactions',
    SANDBOX: '/api/plaid/sandbox_auto_connect'
  }
} as const;

export const DATE_RANGES = {
  LAST_7_DAYS: { days: 7, label: 'Last 7 days' },
  LAST_30_DAYS: { days: 30, label: 'Last 30 days' },
  LAST_90_DAYS: { days: 90, label: 'Last 90 days' },
  THIS_MONTH: { label: 'This month' },
  LAST_MONTH: { label: 'Last month' },
  THIS_YEAR: { label: 'This year' }
} as const;