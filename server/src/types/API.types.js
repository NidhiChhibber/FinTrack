/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Whether request was successful
 * @property {*} [data] - Response data
 * @property {string} [error] - Error message
 * @property {*} [details] - Additional error details
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {*[]} data - Array of data items
 * @property {PaginationMeta} pagination - Pagination metadata
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} totalCount - Total number of items
 * @property {number} totalPages - Total number of pages
 * @property {boolean} hasNext - Whether there's a next page
 * @property {boolean} hasPrev - Whether there's a previous page
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field that failed validation
 * @property {string} message - Validation error message
 * @property {*} [value] - Value that failed validation
 */
