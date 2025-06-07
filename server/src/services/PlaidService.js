// src/services/PlaidService.js
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { PlaidItemRepository } from '../repositories/PlaidItemRepository.js';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { TransactionService } from './TransactionService.js';
import { AccountType } from '../enums/index.js';
import dotenv from 'dotenv';

dotenv.config();

export class PlaidService {
  constructor() {
    console.log('Plaid Config:', {
    clientId: process.env.PLAID_CLIENT_ID ? 'SET' : 'MISSING',
    secret: process.env.PLAID_SECRET ? 'SET' : 'MISSING', 
    env: process.env.PLAID_ENV
  });
    this.plaidClient = new PlaidApi(new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
          'PLAID-SECRET': process.env.PLAID_SECRET || '',
        },
      },
    }));

    this.plaidItemRepo = new PlaidItemRepository();
    this.accountRepo = new AccountRepository();
    this.transactionService = new TransactionService();
  }

  /**
   * Create link token for Plaid Link
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Link token response
   */
  async createLinkToken(userId) {
    const response = await this.plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'FinTrack',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return response.data;
  }

  /**
   * Exchange public token for access token and store item
   * @param {string} publicToken - Public token from Plaid Link
   * @param {Object} metadata - Link metadata
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created item and accounts
   */
  async exchangePublicToken(publicToken, metadata, userId) {
  try {
    console.log('Exchanging public token...');
    
    // Exchange token
    const tokenResponse = await this.plaidClient.itemPublicTokenExchange({ 
      public_token: publicToken 
    });
    const { access_token, item_id } = tokenResponse.data;
    console.log('Access token obtained:', !!access_token);

    // Get accounts
    console.log('Fetching accounts...');
    const accountsResponse = await this.plaidClient.accountsGet({ access_token });
    console.log('Raw accounts response:', JSON.stringify(accountsResponse.data, null, 2));
    
    const plaidAccounts = accountsResponse.data.accounts;
    console.log('Number of accounts returned:', plaidAccounts?.length || 0);

    if (!plaidAccounts || !Array.isArray(plaidAccounts) || plaidAccounts.length === 0) {
      throw new Error(`No accounts returned from Plaid`);
    }

    // Map account types
    const enhancedAccounts = plaidAccounts.map(account => ({
      ...account,
      account_type: this._mapAccountType(account).accountType,
      account_subtype: this._mapAccountType(account).accountSubtype
    }));

    // Create Plaid item with accounts
    const itemData = {
      user_id: userId,
      access_token,
      item_id,
      institution_name: metadata?.institution?.name || 'Unknown Institution'
    };

    const plaidItem = await this.plaidItemRepo.createWithAccounts(itemData, enhancedAccounts);

    // ADD THIS RETURN STATEMENT:
    return {
      plaidItem,
      accounts: enhancedAccounts,
      accountCount: enhancedAccounts.length
    };
    
  } catch (error) {
    console.error('Exchange error details:', error.response?.data || error);
    throw error;
  }
}

  /**
   * Sync transactions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} New transactions
   */
  async syncUserTransactions(userId) {
    const plaidItem = await this.plaidItemRepo.findByUser(userId);
    if (!plaidItem?.access_token) {
      throw new Error('No access token found for user');
    }

    let cursor = plaidItem.cursor || null;
    let allNewTransactions = [];
    let hasMore = true;

    while (hasMore) {
      const { added, next_cursor, has_more } = await this._transactionsSync(
        plaidItem.access_token, 
        cursor
      );

      if (added.length > 0) {
        const savedTransactions = await this.transactionService.saveOrUpdateTransactions(
          added, 
          plaidItem
        );
        allNewTransactions.push(...savedTransactions);
      }

      cursor = next_cursor;
      hasMore = has_more;
    }

    // Update cursor
    await this.plaidItemRepo.updateCursor(plaidItem.item_id, cursor);

    return allNewTransactions;
  }

  /**
   * Get initial transactions (for new connections)
   * @param {string} accessToken - Access token
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Initial transactions
   */
  async getInitialTransactions(accessToken, userId) {
    const plaidItem = await this.plaidItemRepo.findByAccessToken(accessToken);
    if (!plaidItem) {
      throw new Error('Plaid item not found');
    }

    let transactions = [];
    let offset = 0;
    const count = 500;
    const startDate = '2022-01-01'; // 2 years back
    const endDate = new Date().toISOString().split('T')[0];

    while (true) {
      const response = await this.plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count, offset }
      });

      const newTransactions = response.data.transactions;
      
      if (newTransactions.length > 0) {
        const savedTransactions = await this.transactionService.saveOrUpdateTransactions(
          newTransactions, 
          plaidItem
        );
        transactions.push(...savedTransactions);
      }

      offset += newTransactions.length;

      if (transactions.length >= response.data.total_transactions) break;
    }

    return transactions;
  }

  /**
   * Get accounts for user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User accounts
   */
  async getAccountsByUser(userId) {
    return await this.accountRepo.findByUser(userId);
  }

  /**
   * Create sandbox connection (for testing)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Sandbox connection result
   */
  async createSandboxConnection(userId) {
  try {
    console.log('Creating sandbox connection for user:', userId);
    
    // Create sandbox public token
    const sandboxResponse = await this.plaidClient.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // Platypus Bank
      initial_products: ['transactions'],
      options: {
        override_username: userId,
      },
    });
    
    console.log('Sandbox public token created:', !!sandboxResponse.data.public_token);
    
    // Exchange for access token and create item
    const result = await this.exchangePublicToken(
      sandboxResponse.data.public_token,
      { institution: { name: 'Platypus Bank (Sandbox)' } },
      userId
    );
    
    console.log('Exchange result:', result);
    
    // Sync initial transactions after a short delay
    setTimeout(() => {
      this.syncUserTransactions(userId).catch(console.error);
    }, 3000);

    return result;
    
  } catch (error) {
    console.error('Detailed sandbox error:', error.response?.data || error.message);
    throw error;
  }
}

  // Private helper methods

  /**
   * Call Plaid transactions sync API
   * @param {string} accessToken - Access token
   * @param {string} cursor - Sync cursor
   * @returns {Promise<Object>} Sync response
   * @private
   */
  async _transactionsSync(accessToken, cursor) {
    const response = await this.plaidClient.transactionsSync({
      access_token: accessToken,
      cursor,
    });

    const { added, modified, removed, next_cursor, has_more } = response.data;
    return { added, modified, removed, next_cursor, has_more };
  }

  /**
   * Map Plaid account type to our AccountType enum
   * @param {Object} plaidAccount - Plaid account object
   * @returns {Object} Mapped account types
   * @private
   */
  _mapAccountType(plaidAccount) {
    const { type, subtype } = plaidAccount;
    
    let accountType;
    switch (type) {
      case 'depository':
        accountType = subtype === 'checking' ? AccountType.CHECKING : AccountType.SAVINGS;
        break;
      case 'credit':
        accountType = AccountType.CREDIT;
        break;
      case 'investment':
        accountType = AccountType.INVESTMENT;
        break;
      case 'loan':
        accountType = AccountType.LOAN;
        break;
      default:
        accountType = AccountType.CHECKING;
    }
    
    return { 
      accountType, 
      accountSubtype: subtype || accountType 
    };
  }
}