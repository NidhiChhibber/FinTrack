// server/src/repositories/AccountRepository.js
import db from '../../models/index.js'
import { BaseRepository } from './BaseRepository.js';

export class AccountRepository extends BaseRepository {
  constructor() {
    super(db.PlaidAccount);
  }

  /**
   * Find accounts by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of accounts with PlaidItem included
   */
  async findByUser(userId) {
    return await this.findAll({
      include: [{
        model: db.PlaidItem,
        where: { user_id: userId },
        attributes: ['id', 'institution_name', 'item_id'] // Include institution_name
      }],
      order: [['name', 'ASC']]
    });
  }

  /**
   * Find account by Plaid account ID
   * @param {string} plaidAccountId - Plaid account ID
   * @returns {Promise<Object|null>} Account or null
   */
  async findByPlaidAccountId(plaidAccountId) {
    if (!plaidAccountId) return null;

    return await this.findOne({
      where: { account_id: plaidAccountId },
      include: [{
        model: db.PlaidItem,
        attributes: ['id', 'institution_name', 'item_id']
      }]
    });
  }

  /**
   * Find accounts by Plaid Item ID
   * @param {number} plaidItemId - Plaid Item ID
   * @returns {Promise<Array>} Array of accounts
   */
  async findByPlaidItem(plaidItemId) {
    return await this.findAll({
      where: { plaid_item_id: plaidItemId },
      include: [{
        model: db.PlaidItem,
        attributes: ['id', 'institution_name', 'item_id']
      }]
    });
  }

  /**
   * Update account balance
   * @param {number} accountId - Account ID
   * @param {number} balance - New balance
   * @returns {Promise<Object|null>} Updated account
   */
  async updateBalance(accountId, balance) {
    return await this.update(accountId, { 
      balance,
      balance_last_updated: new Date()
    });
  }

  /**
   * Find or create account from Plaid data
   * @param {Object} plaidAccount - Plaid account data
   * @param {number} plaidItemId - Plaid item ID
   * @returns {Promise<Array>} [account, created]
   */
  async findOrCreateFromPlaid(plaidAccount, plaidItemId) {
    return await this.findOrCreate(
      { account_id: plaidAccount.account_id },
      {
        ...plaidAccount,
        plaid_item_id: plaidItemId,
        is_active: true
      }
    );
  }
}