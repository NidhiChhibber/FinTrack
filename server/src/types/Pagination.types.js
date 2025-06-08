/**
 * @typedef {Object} PaginationRequest
 * @property {number} [page=1] - Page number (1-based)
 * @property {number} [limit=50] - Items per page
 * @property {string} [sortBy] - Field to sort by
 * @property {string} [sortOrder='desc'] - Sort order (asc/desc)
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} limit - Items per page
 * @property {number} offset - Items to skip
 * @property {Array<Array<string>>} [order] - Sequelize order clause
 */