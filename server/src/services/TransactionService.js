// src/services/TransactionService.js
import { TransactionRepository } from '../repositories/TransactionRepository.js';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { TransactionType, AccountType } from '../enums/index.js';

export class TransactionService {
  constructor() {
    this.transactionRepo = new TransactionRepository();
    this.accountRepo = new AccountRepository();
  }

  /**
   * Get transactions for user with pagination
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Transactions with pagination
   */
  async getTransactionsByUser(userId, filters = {}, pagination = {}) {
    return await this.transactionRepo.findByUser(userId, filters, pagination);
  }

  /**
   * Get transaction by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @returns {Promise<Object|null>} Transaction or null
   */
  async getTransactionByPlaidId(plaidId) {
    return await this.transactionRepo.findByPlaidId(plaidId);
  }

  /**
   * Create new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(transactionData) {
    // Add enhanced data if not provided
    if (!transactionData.transaction_type) {
      transactionData.transaction_type = this._classifyTransactionType(
        transactionData.amount, 
        transactionData.account_type
      );
    }

    if (!transactionData.normalized_amount) {
      transactionData.normalized_amount = this._calculateNormalizedAmount(
        transactionData.amount,
        transactionData.account_type,
        transactionData.transaction_type
      );
    }

    return await this.transactionRepo.create(transactionData);
  }

  /**
   * Update transaction
   * @param {number} id - Transaction ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>} Updated transaction
   */
  async updateTransaction(id, updateData) {
    // Mark as user corrected if category is being updated
    if (updateData.category) {
      updateData.category_corrected = true;
      updateData.category_source = 'user';
    }

    return await this.transactionRepo.update(id, updateData);
  }

  /**
   * Update transaction category by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object|null>} Updated transaction
   */
  async updateTransactionCategoryByPlaidId(plaidId, updates) {
    updates.category_corrected = true;
    updates.category_source = 'user';
    updates.updatedAt = new Date();

    return await this.transactionRepo.updateByPlaidId(plaidId, updates);
  }

  /**
   * Delete transaction by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteTransactionByPlaidId(plaidId) {
    return await this.transactionRepo.deleteByPlaidId(plaidId);
  }

  /**
   * Save or update transactions from Plaid sync
   * @param {Array} plaidTransactions - Plaid transaction data
   * @param {Object} plaidItem - Plaid item
   * @returns {Promise<Array>} Saved transactions
   */
  async saveOrUpdateTransactions(plaidTransactions, plaidItem) {
    const savedTransactions = [];

    for (const plaidTx of plaidTransactions) {
      try {
        // Find the account for this transaction
        const account = await this.accountRepo.findByPlaidAccountId(plaidTx.account_id);
        if (!account) {
          console.warn(`Account not found for transaction ${plaidTx.transaction_id}`);
          continue;
        }

        // Prepare enriched transaction data
        const enrichmentData = {
          plaid_item_id: plaidItem.id,
          plaid_account_id: account.id,
          account_type: account.account_type,
          account_subtype: account.account_subtype
        };

        // Classify and calculate normalized amount
        const transactionType = this._classifyTransactionType(plaidTx.amount, account.account_type);
        const normalizedAmount = this._calculateNormalizedAmount(
          plaidTx.amount,
          account.account_type,
          transactionType
        );

        enrichmentData.transaction_type = transactionType;
        enrichmentData.normalized_amount = normalizedAmount;

        // Find or create transaction
        const [transaction, created] = await this.transactionRepo.findOrCreateFromPlaid(
          plaidTx, 
          enrichmentData
        );

        // Update if exists and not manually corrected
        if (!created && !transaction.category_corrected) {
          await this.transactionRepo.update(transaction.id, {
            name: plaidTx.name,
            amount: plaidTx.amount,
            normalized_amount: normalizedAmount,
            date: plaidTx.date,
            category: plaidTx.category?.[0] || 'Uncategorized',
            merchant_name: plaidTx.merchant_name || '',
            transaction_type: transactionType
          });
        }

        savedTransactions.push(transaction);
      } catch (error) {
        console.error(`Error saving transaction ${plaidTx.transaction_id}:`, error);
      }
    }

    return savedTransactions;
  }

  // Private helper methods

  /**
   * Classify transaction type based on amount and account type
   * @param {number} amount - Transaction amount
   * @param {string} accountType - Account type
   * @returns {string} Transaction type
   * @private
   */
  _classifyTransactionType(amount, accountType) {
    // Credit cards
    if (accountType === AccountType.CREDIT) {
      return amount > 0 ? TransactionType.PAYMENT : TransactionType.EXPENSE;
    }

    // Bank accounts
    if (accountType === AccountType.CHECKING || accountType === AccountType.SAVINGS) {
      return amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE;
    }

    return amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE;
  }

  /**
   * Calculate normalized amount for UI display
   * @param {number} amount - Original amount
   * @param {string} accountType - Account type
   * @param {string} transactionType - Transaction type
   * @returns {number} Normalized amount
   * @private
   */
  _calculateNormalizedAmount(amount, accountType, transactionType) {
    // Credit cards: expenses are negative, payments are positive
    if (accountType === AccountType.CREDIT) {
      return transactionType === TransactionType.PAYMENT ? Math.abs(amount) : -Math.abs(amount);
    }

    // Bank accounts: income is positive, expenses are negative
    if (accountType === AccountType.CHECKING || accountType === AccountType.SAVINGS) {
      return transactionType === TransactionType.INCOME ? Math.abs(amount) : -Math.abs(amount);
    }

    return amount;
  }
}