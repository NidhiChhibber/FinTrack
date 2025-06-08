/**
 * @typedef {Object} AccountDTO
 * @property {number} id - Internal account ID
 * @property {string} accountId - Plaid account ID
 * @property {string} name - Account name
 * @property {string} [officialName] - Official account name from bank
 * @property {string} type - Original Plaid account type
 * @property {string} [subtype] - Original Plaid account subtype
 * @property {string} accountType - Mapped account type from AccountType enum
 * @property {string} [accountSubtype] - Mapped account subtype
 * @property {number} balance - Current balance
 * @property {number} [availableBalance] - Available balance
 * @property {number} [creditLimit] - Credit limit for credit accounts
 * @property {string} [balanceLastUpdated] - Last balance update timestamp
 * @property {string} [displayName] - User-customized display name
 * @property {string} [color] - UI color theme
 * @property {boolean} isHidden - Hide from main views
 * @property {boolean} isActive - Whether account is active
 * @property {string} [deactivatedAt] - Deactivation timestamp
 * @property {number} plaidItemId - Reference to plaid item
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} AccountCreateRequest
 * @property {string} accountId - Plaid account ID
 * @property {string} name - Account name
 * @property {string} [officialName] - Official name
 * @property {string} type - Plaid account type
 * @property {string} [subtype] - Plaid account subtype
 * @property {string} accountType - Mapped account type
 * @property {string} [accountSubtype] - Mapped account subtype
 * @property {number} balance - Initial balance
 * @property {number} [availableBalance] - Available balance
 * @property {number} [creditLimit] - Credit limit
 * @property {number} plaidItemId - Plaid item reference
 * @property {string} [displayName] - Custom display name
 * @property {string} [color] - UI color
 */

/**
 * @typedef {Object} AccountUpdateRequest
 * @property {string} [displayName] - Updated display name
 * @property {string} [color] - Updated color
 * @property {boolean} [isHidden] - Updated visibility
 * @property {number} [balance] - Updated balance
 * @property {number} [availableBalance] - Updated available balance
 */

// src/types/PlaidItem.types.js
/**
 * @typedef {Object} PlaidItemDTO
 * @property {number} id - Internal plaid item ID
 * @property {string} userId - User identifier
 * @property {string} itemId - Plaid item ID
 * @property {string} institutionName - Financial institution name
 * @property {string} [cursor] - Transaction sync cursor
 * @property {string} [lastSynced] - Last sync timestamp
 * @property {boolean} requiresReauth - Whether item needs re-authentication
 * @property {string} [errorCode] - Last error code
 * @property {string} [errorMessage] - Last error message
 * @property {boolean} isActive - Whether item is active
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} LinkTokenRequest
 * @property {string} userId - User identifier
 * @property {string[]} [products] - Plaid products to request
 * @property {string[]} [countryCodes] - Country codes
 * @property {string} [language] - Language preference
 */

/**
 * @typedef {Object} LinkTokenResponse
 * @property {string} linkToken - Plaid Link token
 * @property {string} expiration - Token expiration timestamp
 * @property {string} requestId - Request identifier
 */

/**
 * @typedef {Object} ExchangeTokenRequest
 * @property {string} publicToken - Public token from Plaid Link
 * @property {Object} [metadata] - Link session metadata
 * @property {Object} [metadata.institution] - Institution info
 * @property {string} [metadata.institution.name] - Institution name
 * @property {string} [metadata.institution.institution_id] - Institution ID
 */

/**
 * @typedef {Object} ExchangeTokenResponse
 * @property {string} itemId - Plaid item ID
 * @property {number} accountsLinked - Number of accounts linked
 * @property {string} [institution] - Institution name
 * @property {AccountDTO[]} [accounts] - Linked accounts
 */

/**
 * @typedef {Object} SyncTransactionsRequest
 * @property {string} userId - User identifier
 */

/**
 * @typedef {Object} SyncTransactionsResponse
 * @property {number} transactionsSynced - Number of transactions synced
 * @property {TransactionDTO[]} transactions - Synced transactions
 */
