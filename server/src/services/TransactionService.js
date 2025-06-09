// server/src/services/TransactionService.js - Complete with all required methods
import { TransactionRepository } from '../repositories/TransactionRepository.js';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { MLCategoryService } from './MLCategoryService.js';
import { TransactionType, AccountType, CategorySource } from '../enums/index.js';
import { TransactionMapper } from '../mappers/TransactionMapper.js';

export class TransactionService {
  constructor() {
    this.transactionRepo = new TransactionRepository();
    this.accountRepo = new AccountRepository();
    this.mlService = new MLCategoryService();
  }

  /**
   * Get transactions for user with pagination (returns DTOs)
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<TransactionDTO[]>} Transaction DTOs
   */
  async getTransactionsByUser(userId, filters = {}, pagination = {}) {
    try {
      console.log('TransactionService.getTransactionsByUser called with:', { userId, filters, pagination });
      
      const transactions = await this.transactionRepo.findByUser(userId, filters, pagination);
      const transactionDTOs = TransactionMapper.toDTOArray(transactions);
      
      console.log('TransactionService returning', transactionDTOs.length, 'transactions');
      return transactionDTOs;
    } catch (error) {
      console.error('Error in TransactionService.getTransactionsByUser:', error);
      throw error;
    }
  }

  /**
   * Get transaction by Plaid ID (returns DTO)
   * @param {string} plaidId - Plaid transaction ID
   * @returns {Promise<TransactionDTO|null>} Transaction DTO or null
   */
  async getTransactionByPlaidId(plaidId) {
    const transaction = await this.transactionRepo.findByPlaidId(plaidId);
    return TransactionMapper.toDTO(transaction);
  }

  /**
   * Create new transaction from DTO with ML prediction
   * @param {Object} transactionData - Transaction data (snake_case from mapper)
   * @returns {Promise<TransactionDTO>} Created transaction DTO
   */
  async createTransaction(transactionData) {
    // Predict category using ML if not provided
    if (!transactionData.category || transactionData.category === 'Uncategorized') {
      const prediction = await this.mlService.predictCategory(
        transactionData.name,
        transactionData.merchant_name
      );
      
      transactionData.category = prediction.category;
      transactionData.category_source = prediction.source;
      transactionData.confidence = prediction.confidence;
      transactionData.category_corrected = false;
    }

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

    // Set defaults
    transactionData.category_source = transactionData.category_source || CategorySource.USER;
    transactionData.category_corrected = transactionData.category_corrected ?? true;
    transactionData.confidence = transactionData.confidence || 0.8;

    const transaction = await this.transactionRepo.create(transactionData);
    return TransactionMapper.toDTO(transaction);
  }

  /**
   * Update transaction by ID (returns DTO)
   * @param {number} id - Transaction ID
   * @param {Object} updateData - Update data (snake_case from mapper)
   * @returns {Promise<TransactionDTO|null>} Updated transaction DTO
   */
  async updateTransaction(id, updateData) {
    // Mark as user corrected if category is being updated
    if (updateData.category) {
      updateData.category_corrected = true;
      updateData.category_source = CategorySource.USER;
      updateData.confidence = 1.0;
    }

    const transaction = await this.transactionRepo.update(id, updateData);
    return TransactionMapper.toDTO(transaction);
  }

  /**
   * Update transaction category by Plaid ID with ML learning
   * @param {string} plaidId - Plaid transaction ID
   * @param {Object} updates - Update data (snake_case)
   * @returns {Promise<TransactionDTO|null>} Updated transaction DTO
   */
  async updateTransactionCategoryByPlaidId(plaidId, updates) {
    updates.category_corrected = true;
    updates.category_source = CategorySource.USER;
    updates.confidence = 1.0;
    updates.updatedAt = new Date();

    const transaction = await this.transactionRepo.updateByPlaidId(plaidId, updates);
    return TransactionMapper.toDTO(transaction);
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
   * Save or update transactions from Plaid sync with ML categorization
   * @param {Array} plaidTransactions - Plaid transaction data
   * @param {Object} plaidItem - Plaid item
   * @returns {Promise<Array>} Saved transactions (models, not DTOs)
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

        // Try ML prediction, fallback to Plaid category
        let category = plaidTx.category?.[0] || 'Uncategorized';
        let categorySource = CategorySource.PLAID;
        let confidence = 0.6; // Default for Plaid categories
        
        try {
          console.log(`Predicting category for: ${plaidTx.name}`);
          const prediction = await this.mlService.predictCategory(
            plaidTx.name, 
            plaidTx.merchant_name
          );
          
          console.log(`ML Prediction result:`, prediction);
          
          if (prediction.category !== 'Uncategorized' && !prediction.error) {
            category = prediction.category;
            categorySource = CategorySource.AI;
            confidence = prediction.confidence; // Use actual ML confidence
          }
        } catch (error) {
          console.warn('ML prediction failed, using Plaid category:', error.message);
        }

        enrichmentData.category = category;
        enrichmentData.category_source = categorySource;
        enrichmentData.confidence = confidence; // Now uses actual confidence
        enrichmentData.category_corrected = false;

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
          const updateData = {
            name: plaidTx.name,
            amount: plaidTx.amount,
            normalized_amount: normalizedAmount,
            date: plaidTx.date,
            category: category,
            merchant_name: plaidTx.merchant_name || '',
            transaction_type: transactionType,
            category_source: categorySource,
            confidence: confidence // Update with actual confidence
          };

          await this.transactionRepo.update(transaction.id, updateData);
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