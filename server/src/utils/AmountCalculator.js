import { AccountType, TransactionType } from '../enums/index.js';
import { TRANSACTION_CONSTANTS } from '../constants/index.js';

export class AmountCalculator {
  /**
   * Calculate normalized amount based on account type and transaction type
   * @param {number} amount - Original transaction amount
   * @param {string} accountType - Account type from AccountType enum
   * @param {string} transactionType - Transaction type from TransactionType enum
   * @returns {number} Normalized amount for UI display
   */
  static calculateNormalizedAmount(amount, accountType, transactionType) {
    if (typeof amount !== 'number') {
      throw new Error('Amount must be a number');
    }

    // Credit cards: expenses are negative, payments are positive
    if (accountType === AccountType.CREDIT) {
      return transactionType === TransactionType.PAYMENT 
        ? Math.abs(amount) 
        : -Math.abs(amount);
    }
    
    // Bank accounts: income is positive, expenses are negative  
    if (accountType === AccountType.CHECKING || accountType === AccountType.SAVINGS) {
      return transactionType === TransactionType.INCOME 
        ? Math.abs(amount) 
        : -Math.abs(amount);
    }
    
    // Investment and loan accounts
    if (accountType === AccountType.INVESTMENT) {
      return amount; // Keep original sign for investments
    }
    
    if (accountType === AccountType.LOAN) {
      return transactionType === TransactionType.PAYMENT
        ? -Math.abs(amount) // Payments reduce loan balance
        : Math.abs(amount);  // Borrowing increases loan balance
    }
    
    return amount;
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, options = {}) {
    const { 
      showSign = true, 
      currency = 'USD', 
      locale = 'en-US',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2 
    } = options;
    
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '$0.00';
    }
    
    const formatted = Math.abs(amount).toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    });
    
    if (!showSign) return formatted;
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  /**
   * Determine if amount represents income for UI purposes
   * @param {number} normalizedAmount - Normalized amount
   * @returns {boolean} True if income
   */
  static isIncomeAmount(normalizedAmount) {
    return typeof normalizedAmount === 'number' && normalizedAmount > 0;
  }

  /**
   * Determine if amount represents expense for UI purposes  
   * @param {number} normalizedAmount - Normalized amount
   * @returns {boolean} True if expense
   */
  static isExpenseAmount(normalizedAmount) {
    return typeof normalizedAmount === 'number' && normalizedAmount < 0;
  }

  /**
   * Calculate percentage of total
   * @param {number} amount - Part amount
   * @param {number} total - Total amount
   * @returns {number} Percentage (0-100)
   */
  static calculatePercentage(amount, total) {
    if (typeof amount !== 'number' || typeof total !== 'number' || total === 0) {
      return 0;
    }
    return Math.round((Math.abs(amount) / Math.abs(total)) * 100 * 100) / 100;
  }

  /**
   * Validate amount is within acceptable range
   * @param {number} amount - Amount to validate
   * @returns {boolean} True if valid
   */
  static isValidAmount(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return false;
    }
    
    const { MAX_AMOUNT, MIN_AMOUNT } = TRANSACTION_CONSTANTS.VALIDATION;
    return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  }

  /**
   * Round amount to 2 decimal places
   * @param {number} amount - Amount to round
   * @returns {number} Rounded amount
   */
  static roundAmount(amount) {
    if (typeof amount !== 'number') return 0;
    return Math.round(amount * 100) / 100;
  }
}