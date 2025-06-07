export { TRANSACTION_CONSTANTS } from './transaction.constants.js';
export { ACCOUNT_CONSTANTS } from './account.constants.js';
export { PLAID_CONSTANTS } from './plaid.constants.js';
export { API_CONSTANTS } from './api.constants.js';

// ================================
// 3. TYPE DEFINITIONS (JS Docs for type safety)
// ================================

// src/types/Transaction.types.js
/**
 * @typedef {Object} TransactionDTO
 * @property {string} id - Unique identifier
 * @property {string} plaidId - Plaid transaction ID
 * @property {string} name - Transaction name
 * @property {number} amount - Original amount from Plaid
 * @property {number} normalizedAmount - Normalized amount for UI display
 * @property {string} date - Transaction date (YYYY-MM-DD)
 * @property {string} category - Transaction category
 * @property {string} [merchantName] - Merchant name
 * @property {string} transactionType - Type from TransactionType enum
 * @property {string} accountType - Type from AccountType enum
 * @property {string} [accountSubtype] - Subtype from AccountSubtype enum
 * @property {string} [accountName] - User-friendly account name
 * @property {boolean} isRecurring - Whether transaction is recurring
 * @property {number} confidence - Classification confidence (0-1)
 * @property {string} [description] - User notes
 * @property {string[]} [tags] - User-defined tags
 * @property {boolean} isExcludedFromBudget - Exclude from budget calculations
 * @property {boolean} categoryCorrected - User manually corrected category
 * @property {string} categorySource - Source of categorization
 * @property {number} plaidItemId - Reference to plaid item
 * @property {number} plaidAccountId - Reference to plaid account
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {AccountDTO} [account] - Associated account details
 */

/**
 * @typedef {Object} TransactionCreateRequest
 * @property {string} name - Transaction name
 * @property {number} amount - Transaction amount
 * @property {string} date - Transaction date
 * @property {string} [category] - Transaction category
 * @property {string} [merchantName] - Merchant name
 * @property {string} [transactionType] - Transaction type
 * @property {number} plaidAccountId - Account ID
 * @property {string} [description] - User description
 * @property {string[]} [tags] - User tags
 */

/**
 * @typedef {Object} TransactionUpdateRequest
 * @property {string} [category] - Updated category
 * @property {string} [transactionType] - Updated transaction type
 * @property {string} [description] - Updated description
 * @property {string[]} [tags] - Updated tags
 * @property {boolean} [isExcludedFromBudget] - Budget exclusion flag
 */

/**
 * @typedef {Object} TransactionFilters
 * @property {string} [startDate] - Filter start date
 * @property {string} [endDate] - Filter end date
 * @property {string[]} [accountTypes] - Account types to include
 * @property {string[]} [transactionTypes] - Transaction types to include
 * @property {string[]} [categories] - Categories to include
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 * @property {string} [merchantName] - Merchant name search
 * @property {boolean} [excludeTransfers] - Exclude transfer transactions
 * @property {boolean} [onlyRecurring] - Only recurring transactions
 */

// src/types/Account.types.js
/**
 * @typedef {Object} AccountDTO
 * @property {number} id - Account ID
 * @property {string} plaidAccountId - Plaid account ID
 * @property {string} name - Account name
 * @property {string} [officialName] - Official account name
 * @property {string} type - Account type from AccountType enum
 * @property {string} [subtype] - Account subtype
 * @property {number} balance - Current balance
 * @property {number} [availableBalance] - Available balance
 * @property {number} [creditLimit] - Credit limit for credit accounts
 * @property {boolean} isActive - Whether account is active
 * @property {number} plaidItemId - Reference to plaid item
 * @property {string} [displayName] - User-customized name
 * @property {string} [color] - UI color theme
 * @property {boolean} [isHidden] - Hide from main views
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

// src/types/Analytics.types.js
/**
 * @typedef {Object} TransactionSummary
 * @property {number} totalIncome - Total income amount
 * @property {number} totalExpenses - Total expense amount
 * @property {number} netIncome - Net income (income - expenses)
 * @property {number} transactionCount - Total transaction count
 * @property {number} checkingBalance - Total checking balance
 * @property {number} savingsBalance - Total savings balance
 * @property {number} creditCardDebt - Total credit card debt
 * @property {CategoryBreakdown[]} categoryBreakdown - Spending by category
 * @property {MonthlyTrend[]} [monthlyTrends] - Monthly spending trends
 */

/**
 * @typedef {Object} CategoryBreakdown
 * @property {string} category - Category name
 * @property {number} amount - Total amount for category
 * @property {number} percentage - Percentage of total spending
 * @property {number} transactionCount - Number of transactions
 */

/**
 * @typedef {Object} MonthlyTrend
 * @property {string} month - Month identifier
 * @property {number} income - Income for month
 * @property {number} expenses - Expenses for month
 * @property {number} netIncome - Net income for month
 */