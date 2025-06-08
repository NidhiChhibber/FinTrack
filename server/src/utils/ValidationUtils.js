import { TRANSACTION_CONSTANTS, ACCOUNT_CONSTANTS } from '../constants/index.js';
import { AccountType, TransactionType } from '../enums/index.js';
import { AmountCalculator } from './AmountCalculator.js';
import { DateUtils } from './DateUtils.js';

export class ValidationUtils {
  /**
   * Validate transaction DTO data
   * @param {TransactionCreateRequest} transactionData - Transaction DTO to validate
   * @returns {Object} Validation result with errors array
   */
  static validateTransaction(transactionData) {
    const errors = [];
    const { name, amount, date, plaidAccountId } = transactionData;

    // Required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Transaction name is required' });
    }

    if (name && name.length > TRANSACTION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH) {
      errors.push({ 
        field: 'name', 
        message: `Name must be less than ${TRANSACTION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} characters` 
      });
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      errors.push({ field: 'amount', message: 'Amount must be a valid number' });
    }

    if (amount !== undefined && !AmountCalculator.isValidAmount(amount)) {
      errors.push({ field: 'amount', message: 'Amount is outside valid range' });
    }

    if (!date) {
      errors.push({ field: 'date', message: 'Transaction date is required' });
    } else if (!DateUtils.parseDate(date)) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    }

    if (!plaidAccountId || typeof plaidAccountId !== 'number') {
      errors.push({ field: 'plaidAccountId', message: 'Valid account ID is required' });
    }

    // Optional field validation
    if (transactionData.transactionType && !this.isValidTransactionType(transactionData.transactionType)) {
      errors.push({ field: 'transactionType', message: 'Invalid transaction type' });
    }

    if (transactionData.accountType && !this.isValidAccountType(transactionData.accountType)) {
      errors.push({ field: 'accountType', message: 'Invalid account type' });
    }

    if (transactionData.description && transactionData.description.length > TRANSACTION_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH) {
      errors.push({ 
        field: 'description', 
        message: `Description must be less than ${TRANSACTION_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH} characters` 
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate account DTO data
   * @param {AccountCreateRequest} accountData - Account DTO to validate
   * @returns {Object} Validation result with errors array
   */
  static validateAccount(accountData) {
    const errors = [];
    const { name, accountType, balance } = accountData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Account name is required' });
    }

    if (name && name.length > ACCOUNT_CONSTANTS.VALIDATION.MAX_NAME_LENGTH) {
      errors.push({ 
        field: 'name', 
        message: `Name must be less than ${ACCOUNT_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} characters` 
      });
    }

    if (!accountType || !Object.values(AccountType).includes(accountType)) {
      errors.push({ field: 'accountType', message: 'Valid account type is required' });
    }

    if (balance !== undefined && (typeof balance !== 'number' || isNaN(balance))) {
      errors.push({ field: 'balance', message: 'Balance must be a valid number' });
    }

    if (balance !== undefined) {
      const { MIN_BALANCE, MAX_BALANCE } = ACCOUNT_CONSTANTS.VALIDATION;
      if (balance < MIN_BALANCE || balance > MAX_BALANCE) {
        errors.push({ field: 'balance', message: 'Balance is outside valid range' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate pagination parameters with DTO structure
   * @param {PaginationRequest} params - Pagination parameters
   * @returns {Object} Validation result
   */
  static validatePagination(params) {
    const errors = [];
    const { page, limit, sortBy, sortOrder } = params;

    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }

    const limitNum = parseInt(limit);
    const { MIN_PAGE_SIZE, MAX_PAGE_SIZE } = TRANSACTION_CONSTANTS.PAGINATION;
    
    if (isNaN(limitNum) || limitNum < MIN_PAGE_SIZE || limitNum > MAX_PAGE_SIZE) {
      errors.push({ 
        field: 'limit', 
        message: `Limit must be between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}` 
      });
    }

    // Validate sort parameters
    if (sortBy && typeof sortBy !== 'string') {
      errors.push({ field: 'sortBy', message: 'Sort field must be a string' });
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      errors.push({ field: 'sortOrder', message: 'Sort order must be "asc" or "desc"' });
    }

    return {
      isValid: errors.length === 0,
      errors,
      page: isNaN(pageNum) ? 1 : pageNum,
      limit: isNaN(limitNum) ? TRANSACTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE : limitNum,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || 'desc'
    };
  }

  /**
   * Validate date range with DTO structure
   * @param {Object} dateRange - Date range object
   * @param {string} dateRange.startDate - Start date
   * @param {string} dateRange.endDate - End date
   * @returns {Object} Validation result
   */
  static validateDateRange(dateRange) {
    const errors = [];
    const { startDate, endDate } = dateRange;

    if (startDate && !DateUtils.parseDate(startDate)) {
      errors.push({ field: 'startDate', message: 'Invalid start date format' });
    }

    if (endDate && !DateUtils.parseDate(endDate)) {
      errors.push({ field: 'endDate', message: 'Invalid end date format' });
    }

    if (startDate && endDate && !DateUtils.isValidDateRange(startDate, endDate)) {
      errors.push({ field: 'dateRange', message: 'Start date must be before end date' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Sanitize string input
   * @param {string} input - String to sanitize
   * @param {number} maxLength - Maximum length
   * @returns {string} Sanitized string
   */
  static sanitizeString(input, maxLength = 255) {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove potential XSS characters
  }

  /**
   * Validate transaction type
   * @param {string} type - Transaction type to validate
   * @returns {boolean} True if valid
   */
  static isValidTransactionType(type) {
    return type && Object.values(TransactionType).includes(type);
  }

  /**
   * Validate account type
   * @param {string} type - Account type to validate
   * @returns {boolean} True if valid
   */
  static isValidAccountType(type) {
    return type && Object.values(AccountType).includes(type);
  }

  /**
   * Validate transaction filters DTO
   * @param {TransactionFilters} filters - Transaction filters
   * @returns {Object} Validation result
   */
  static validateTransactionFilters(filters) {
    const errors = [];

    if (filters.startDate || filters.endDate) {
      const dateValidation = this.validateDateRange({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      errors.push(...dateValidation.errors);
    }

    if (filters.accountTypes && !Array.isArray(filters.accountTypes)) {
      errors.push({ field: 'accountTypes', message: 'Account types must be an array' });
    }

    if (filters.transactionTypes && !Array.isArray(filters.transactionTypes)) {
      errors.push({ field: 'transactionTypes', message: 'Transaction types must be an array' });
    }

    if (filters.categories && !Array.isArray(filters.categories)) {
      errors.push({ field: 'categories', message: 'Categories must be an array' });
    }

    if (filters.minAmount !== undefined && (typeof filters.minAmount !== 'number' || isNaN(filters.minAmount))) {
      errors.push({ field: 'minAmount', message: 'Minimum amount must be a number' });
    }

    if (filters.maxAmount !== undefined && (typeof filters.maxAmount !== 'number' || isNaN(filters.maxAmount))) {
      errors.push({ field: 'maxAmount', message: 'Maximum amount must be a number' });
    }

    if (filters.minAmount !== undefined && filters.maxAmount !== undefined && filters.minAmount > filters.maxAmount) {
      errors.push({ field: 'amountRange', message: 'Minimum amount cannot be greater than maximum amount' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}