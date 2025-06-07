// src/repositories/TransactionRepository.js
import db from '../../models/index.js'
import { BaseRepository } from './BaseRepository.js';
import { Op } from 'sequelize';

export class TransactionRepository extends BaseRepository {
  constructor() {
    super(db.Transaction);
  }

  /**
   * Find transactions by user ID
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of transactions
   */
  async findByUser(userId, filters = {}) {
    const userAccountIds = await this._getUserAccountIds(userId);
    if (userAccountIds.length === 0) return [];

    const whereClause = {
      plaid_account_id: { [Op.in]: userAccountIds },
      ...this._buildDateFilter(filters)
    };

    return await this.findAll({
      where: whereClause,
      include: [{
        model: db.PlaidAccount,
        as: 'Account',
        attributes: ['id', 'name', 'account_type']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Find transactions by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @returns {Promise<Object|null>} Transaction or null
   */
  async findByPlaidId(plaidId) {
    if (!plaidId) return null;

    return await this.findOne({
      where: { plaid_id: plaidId }
    });
  }

  /**
   * Update transaction by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object|null>} Updated transaction
   */
  async updateByPlaidId(plaidId, updates) {
    if (!plaidId || !updates) return null;

    const transaction = await this.findByPlaidId(plaidId);
    if (!transaction) return null;

    await transaction.update(updates);
    return transaction;
  }

  /**
   * Delete transaction by Plaid ID
   * @param {string} plaidId - Plaid transaction ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteByPlaidId(plaidId) {
    if (!plaidId) return false;

    const deletedCount = await this.model.destroy({
      where: { plaid_id: plaidId }
    });

    return deletedCount > 0;
  }

  /**
   * Find or create transaction from Plaid data
   * @param {Object} plaidTransaction - Plaid transaction data
   * @param {Object} enrichmentData - Additional data
   * @returns {Promise<Array>} [transaction, created]
   */
  async findOrCreateFromPlaid(plaidTransaction, enrichmentData = {}) {
    return await this.findOrCreate(
      { plaid_id: plaidTransaction.transaction_id },
      {
        plaid_id: plaidTransaction.transaction_id,
        name: plaidTransaction.name,
        amount: plaidTransaction.amount,
        date: plaidTransaction.date,
        category: plaidTransaction.category?.[0] || 'Uncategorized',
        merchant_name: plaidTransaction.merchant_name || '',
        category_source: 'plaid',
        category_corrected: false,
        ...enrichmentData
      }
    );
  }

  // Private helper methods

  /**
   * Get user's account IDs
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of account IDs
   * @private
   */
  async _getUserAccountIds(userId) {
    const userAccounts = await db.PlaidAccount.findAll({
      include: [{
        model: db.PlaidItem,
        where: { user_id: userId }
      }],
      attributes: ['id']
    });

    return userAccounts.map(acc => acc.id);
  }

  /**
   * Build date filter clause
   * @param {Object} filters - Date filters
   * @returns {Object} Date where clause
   * @private
   */
  _buildDateFilter(filters) {
    const dateFilter = {};

    if (filters.startDate || filters.endDate) {
      dateFilter.date = {};
      if (filters.startDate) dateFilter.date[Op.gte] = new Date(filters.startDate);
      if (filters.endDate) dateFilter.date[Op.lte] = new Date(filters.endDate);
    }

    return dateFilter;
  }
}