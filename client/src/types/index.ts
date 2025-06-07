export interface Transaction {
  id: string;
  plaidId: string;
  name: string;
  amount: number;
  normalizedAmount: number;
  date: string;
  category: string;
  merchantName?: string;
  transactionType: 'income' | 'expense' | 'transfer' | 'payment' | 'refund' | 'fee';
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  isRecurring: boolean;
  categoryCorrected: boolean;
  description?: string;
  tags?: string[];
  account: {
    id: string;
    name: string;
    type: string;
    institutionName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  plaidAccountId: string;
  name: string;
  officialName?: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  subtype?: string;
  balance: number;
  availableBalance?: number;
  creditLimit?: number;
  isActive: boolean;
  displayName?: string;
  color?: string;
  isHidden?: boolean;
  institutionName: string;
  lastUpdated: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  accountType?: string;
  transactionType?: string;
  search?: string;
  accountId?: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  recentTransactions: Transaction[];
}

// ADD MISSING TYPES
export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  currency: string;
  dateFormat: string;
  notifications: boolean;
  autoSync: boolean;
}