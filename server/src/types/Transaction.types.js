/**
 * @typedef {Object} TransactionDTO
 * @property {number} id - Unique identifier
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
 * @property {boolean} isRecurring - Whether transaction is recurring
 * @property {boolean} isExcludedFromBudget - Exclude from budget calculations
 * @property {boolean} categoryCorrected - User manually corrected category
 * @property {string} categorySource - Source of categorization
 * @property {number} confidence - Classification confidence (0-1)
 * @property {string} [description] - User notes
 * @property {string[]} [tags] - User-defined tags
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
 * @property {number} [normalizedAmount] - Normalized amount (calculated if not provided)
 * @property {string} date - Transaction date (YYYY-MM-DD)
 * @property {string} [category] - Transaction category
 * @property {string} [merchantName] - Merchant name
 * @property {string} [transactionType] - Transaction type
 * @property {string} [accountType] - Account type
 * @property {string} [accountSubtype] - Account subtype
 * @property {number} plaidAccountId - Account ID
 * @property {number} [plaidItemId] - Plaid item ID
 * @property {string} [description] - User description
 * @property {string[]} [tags] - User tags
 * @property {boolean} [isRecurring] - Is recurring transaction
 * @property {boolean} [isExcludedFromBudget] - Exclude from budget
 */

/**
 * @typedef {Object} TransactionUpdateRequest
 * @property {string} [category] - Updated category
 * @property {string} [transactionType] - Updated transaction type
 * @property {string} [merchantName] - Updated merchant name
 * @property {string} [description] - Updated description
 * @property {string[]} [tags] - Updated tags
 * @property {boolean} [isExcludedFromBudget] - Budget exclusion flag
 */

/**
 * @typedef {Object} TransactionFilters
 * @property {string} [startDate] - Filter start date (YYYY-MM-DD)
 * @property {string} [endDate] - Filter end date (YYYY-MM-DD)
 * @property {string[]} [accountTypes] - Account types to include
 * @property {string[]} [transactionTypes] - Transaction types to include
 * @property {string[]} [categories] - Categories to include
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 * @property {string} [merchantName] - Merchant name search
 * @property {boolean} [excludeTransfers] - Exclude transfer transactions
 * @property {boolean} [onlyRecurring] - Only recurring transactions
 * @property {boolean} [excludeFromBudget] - Only budget-excluded transactions
 */
