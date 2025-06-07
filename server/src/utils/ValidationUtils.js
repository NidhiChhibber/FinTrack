import { TRANSACTION_CONSTANTS, ACCOUNT_CONSTANTS } from '../constants/index.js';
import { AccountType, TransactionType } from '../enums/index.js';

export class ValidationUtils {
  /**
   * Validate transaction data
   * @param {Object} transactionData - Transaction data to validate
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

    if (!AmountCalculator.isValidAmount(amount)) {
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

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate account data
   * @param {Object} accountData - Account data to validate
   * @returns {Object} Validation result with errors array
   */
  static validateAccount(accountData) {
    const errors = [];
    const { name, type, balance } = accountData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Account name is required' });
    }

    if (name && name.length > ACCOUNT_CONSTANTS.VALIDATION.MAX_NAME_LENGTH) {
      errors.push({ 
        field: 'name', 
        message: `Name must be less than ${ACCOUNT_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} characters` 
      });
    }

    if (!type || !Object.values(AccountType).includes(type)) {
      errors.push({ field: 'type', message: 'Valid account type is required' });
    }

    if (typeof balance !== 'number' || isNaN(balance)) {
      errors.push({ field: 'balance', message: 'Balance must be a valid number' });
    }

    const { MIN_BALANCE, MAX_BALANCE } = ACCOUNT_CONSTANTS.VALIDATION;
    if (balance < MIN_BALANCE || balance > MAX_BALANCE) {
      errors.push({ field: 'balance', message: 'Balance is outside valid range' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate pagination parameters
   * @param {Object} params - Pagination parameters
   * @returns {Object} Validation result
   */
  static validatePagination(params) {
    const errors = [];
    const { page, limit } = params;

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

    return {
      isValid: errors.length === 0,
      errors,
      page: isNaN(pageNum) ? 1 : pageNum,
      limit: isNaN(limitNum) ? TRANSACTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE : limitNum
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
}