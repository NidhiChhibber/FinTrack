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