// server/src/services/TransactionService.js - Simple ML integration
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

  // ... (keep all existing methods as they were)

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

  /**
   * Update transaction category by Plaid ID
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

  // ... (keep all other existing methods unchanged)

  /**
   * Classify transaction type based on amount and account type
   * @param {number} amount - Transaction amount
   * @param {string} accountType - Account type
   * @returns {string} Transaction type
   * @private
   */
  _classifyTransactionType(amount, accountType) {
    if (accountType === AccountType.CREDIT) {
      return amount > 0 ? TransactionType.PAYMENT : TransactionType.EXPENSE;
    }

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
    if (accountType === AccountType.CREDIT) {
      return transactionType === TransactionType.PAYMENT ? Math.abs(amount) : -Math.abs(amount);
    }

    if (accountType === AccountType.CHECKING || accountType === AccountType.SAVINGS) {
      return transactionType === TransactionType.INCOME ? Math.abs(amount) : -Math.abs(amount);
    }

    return amount;
  }
}