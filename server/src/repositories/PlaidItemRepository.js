// src/repositories/PlaidItemRepository.js
import db from '../../models/index.js'
import { BaseRepository } from './BaseRepository.js';

export class PlaidItemRepository extends BaseRepository {
  constructor() {
    super(db.PlaidItem);
  }

  /**
   * Find primary Plaid item by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Plaid item or null
   */
  async findByUser(userId) {
    return await this.findOne({
      where: { user_id: userId }
    });
  }

  /**
   * Find Plaid item by access token
   * @param {string} accessToken - Access token
   * @returns {Promise<Object|null>} Plaid item or null
   */
  async findByAccessToken(accessToken) {
    return await this.findOne({
      where: { access_token: accessToken }
    });
  }

  /**
   * Find Plaid item by Plaid item ID
   * @param {string} plaidItemId - Plaid item ID
   * @returns {Promise<Object|null>} Plaid item or null
   */
  async findByPlaidItemId(plaidItemId) {
    return await this.findOne({
      where: { item_id: plaidItemId }
    });
  }

  /**
   * Update cursor for transaction sync
   * @param {string} plaidItemId - Plaid item ID
   * @param {string} cursor - New cursor value
   * @returns {Promise<Object|null>} Updated item
   */
  async updateCursor(plaidItemId, cursor) {
    const item = await this.findByPlaidItemId(plaidItemId);
    if (!item) return null;

    return await this.update(item.id, {
      cursor,
      last_synced: new Date()
    });
  }

  /**
   * Create new Plaid item with accounts
   * @param {Object} itemData - Plaid item data
   * @param {Array} accountsData - Array of account data
   * @returns {Promise<Object>} Created item
   */
  async createWithAccounts(itemData, accountsData) {
  const transaction = await db.sequelize.transaction();

  try {
    console.log('Creating Plaid item with transaction...');
    
    // Create the Plaid item
    const item = await this.model.create(itemData, { transaction });
    console.log('Created Plaid item:', item.id);

    // Create associated accounts
    if (accountsData && accountsData.length > 0) {
      const accountsWithItemId = accountsData.map(account => ({
        ...account,
        plaid_item_id: item.id
      }));

      console.log('Creating accounts:', accountsWithItemId.length);
      const createdAccounts = await db.PlaidAccount.bulkCreate(
        accountsWithItemId, 
        { 
          transaction,
          returning: true // Ensure we get the created records
        }
      );
      console.log('Created accounts in transaction:', createdAccounts.length);
    }

    await transaction.commit();
    console.log('Transaction committed successfully');
    return item;
    
  } catch (error) {
    console.error('Error in createWithAccounts:', error);
    await transaction.rollback();
    throw error;
  }
  }
}