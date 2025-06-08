/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Whether request was successful
 * @property {*} [data] - Response data
 * @property {string} [error] - Error message
 * @property {*} [details] - Additional error details
 * @property {string} [timestamp] - Response timestamp
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success - Whether request was successful
 * @property {*[]} data - Array of data items
 * @property {PaginationMeta} pagination - Pagination metadata
 * @property {Object} [meta] - Additional metadata
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} total - Total items in current page
 * @property {boolean} hasMore - Whether there are more pages
 * @property {number} [totalCount] - Total number of items across all pages
 * @property {number} [totalPages] - Total number of pages
 * @property {boolean} [hasNext] - Whether there's a next page
 * @property {boolean} [hasPrev] - Whether there's a previous page
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field that failed validation
 * @property {string} message - Validation error message
 * @property {*} [value] - Value that failed validation
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {string} error - Error message
 * @property {ValidationError[]|string|Object} [details] - Additional error details
 * @property {string} [timestamp] - Error timestamp
 * @property {string} [path] - Request path that caused error
 * @property {string} [method] - HTTP method that caused error
 */