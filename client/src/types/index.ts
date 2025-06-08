// client/src/types/index.ts

// Transaction Types
export interface TransactionDTO {
  id: number;
  plaidId: string;
  name: string;
  amount: number;
  normalizedAmount: number;
  date: string; // YYYY-MM-DD
  category: string;
  merchantName?: string;
  transactionType: 'income' | 'expense' | 'transfer' | 'payment' | 'refund' | 'fee';
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  accountSubtype?: string;
  isRecurring: boolean;
  isExcludedFromBudget: boolean;
  categoryCorrected: boolean;
  categorySource: 'plaid' | 'user' | 'ai' | 'rule';
  confidence: number;
  description?: string;
  tags?: string[];
  plaidItemId: number;
  plaidAccountId: number;
  createdAt: string;
  updatedAt: string;
  account?: AccountDTO;
}

// Account Types
export interface AccountDTO {
  id: number;
  accountId: string;
  name: string;
  officialName?: string;
  type: string;
  subtype?: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  accountSubtype?: string;
  balance: number;
  availableBalance?: number;
  creditLimit?: number;
  balanceLastUpdated?: string;
  displayName?: string;
  color?: string;
  isHidden: boolean;
  isActive: boolean;
  deactivatedAt?: string;
  plaidItemId: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  checkingBalance: number;
  savingsBalance: number;
  creditCardDebt: number;
  investmentValue: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends?: MonthlyTrend[];
  periodStart: string;
  periodEnd: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  color?: string;
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  monthName: string;
  income: number;
  expenses: number;
  netIncome: number;
  transactionCount: number;
}

// Plaid Item Types
export interface PlaidItemDTO {
  id: number;
  userId: string;
  itemId: string;
  institutionName: string;
  cursor?: string;
  lastSynced?: string;
  requiresReauth: boolean;
  errorCode?: string;
  errorMessage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Dashboard specific types
export interface DashboardData {
  transactions: TransactionDTO[];
  accounts: AccountDTO[];
  summary: TransactionSummary;
  monthlyTrends: MonthlyTrend[];
}

export interface AccountSummary {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  accountBreakdown: {
    checking: number;
    savings: number;
    credit: number;
    investment: number;
    loan: number;
  };
}

// Component Props Types
export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount?: number;
}

export interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

export interface MonthlyTotals {
  income: number;
  expenses: number;
  net: number;
  transactionCount?: number;
}

// Utility Types
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountTypes?: string[];
  transactionTypes?: string[];
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
  merchantName?: string;
  excludeTransfers?: boolean;
  onlyRecurring?: boolean;
}

// Form Types
export interface TransactionCreateRequest {
  name: string;
  amount: number;
  normalizedAmount?: number;
  date: string;
  category?: string;
  merchantName?: string;
  transactionType?: string;
  accountType?: string;
  accountSubtype?: string;
  plaidAccountId: number;
  plaidItemId?: number;
  description?: string;
  tags?: string[];
  isRecurring?: boolean;
  isExcludedFromBudget?: boolean;
}

export interface TransactionUpdateRequest {
  category?: string;
  transactionType?: string;
  merchantName?: string;
  description?: string;
  tags?: string[];
  isExcludedFromBudget?: boolean;
}

export interface AccountUpdateRequest {
  displayName?: string;
  color?: string;
  isHidden?: boolean;
  balance?: number;
  availableBalance?: number;
}

// Account types for the component you showed
export interface Account {
  id: number;
  name: string;
  balance: number;
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  accountId?: string;
}

// Export account type enum values for consistency
export const AccountType = {
  CHECKING: 'checking',
  SAVINGS: 'savings', 
  CREDIT: 'credit',
  INVESTMENT: 'investment',
  LOAN: 'loan'
} as const;

export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  REFUND: 'refund',
  FEE: 'fee'
} as const;