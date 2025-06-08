import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { PlaidItemRepository } from '../repositories/PlaidItemRepository.js';
import { AccountRepository } from '../repositories/AccountRepository.js';
import { TransactionService } from './TransactionService.js';
import { AccountType } from '../enums/index.js';
import { AccountMapper, TransactionMapper } from '../mappers/index.js';
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
   * @returns {Promise<Object>} Created item and accounts (with DTOs)
   */
  async exchangePublicToken(publicToken, metadata, userId) {
  try {
    console.log('Exchanging public token for user:', userId);
    
    // Exchange token
    const tokenResponse = await this.plaidClient.itemPublicTokenExchange({ 
      public_token: publicToken 
    });
    const { access_token, item_id } = tokenResponse.data;

    // Get accounts
    const accountsResponse = await this.plaidClient.accountsGet({ access_token });
    const plaidAccounts = accountsResponse.data.accounts;

    if (!plaidAccounts || plaidAccounts.length === 0) {
      throw new Error('No accounts returned from Plaid');
    }

    // Create item and accounts in transaction
    const result = await this.plaidItemRepo.createWithAccounts(
      {
        user_id: userId,
        access_token,
        item_id,
        institution_name: metadata?.institution?.name || 'Unknown Institution'
      },
      plaidAccounts.map(account => {
        const mapped = this._mapAccountType(account);
        return {
          account_id: account.account_id,
          name: account.name,
          official_name: account.official_name,
          type: account.type,
          subtype: account.subtype,
          account_type: mapped.accountType,
          account_subtype: mapped.accountSubtype,
          balance: account.balances.current || 0,
          available_balance: account.balances.available,
          credit_limit: account.balances.limit,
          is_active: true
        };
      })
    );

    // Get the created accounts
    const accounts = await this.accountRepo.findByPlaidItem(result.id);
    console.log('Created accounts:', accounts.length);

    // Start transaction sync after longer delay to ensure accounts are ready
    setTimeout(async () => {
      try {
        console.log('Starting delayed transaction sync...');
        const transactions = await this.getInitialTransactions(access_token, userId);
        console.log('Sync completed:', transactions.length, 'transactions');
      } catch (error) {
        console.error('Initial sync failed:', error);
      }
    }, 5000); // Increased delay to 5 seconds

    return {
      plaidItem: result,
      accounts,
      accountCount: accounts.length
    };
    
  } catch (error) {
    console.error('Exchange error:', error.response?.data || error);
    throw error;
  }
}

  /**
   * Sync transactions for a user (returns DTOs)
   * @param {string} userId - User ID
   * @returns {Promise<TransactionDTO[]>} New transaction DTOs
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
      console.log("Found transactions", added.length);

      if (added.length > 0) {
        const savedTransactions = await this.transactionService.saveOrUpdateTransactions(
          added, 
          plaidItem
        );
        // Convert to DTOs
        const transactionDTOs = TransactionMapper.toDTOArray(savedTransactions);
        allNewTransactions.push(...transactionDTOs);
      }

      cursor = next_cursor;
      hasMore = has_more;
    }

    // Update cursor
    await this.plaidItemRepo.updateCursor(plaidItem.item_id, cursor);

    return allNewTransactions;
  }

  /**
   * Get initial transactions (for new connections) - returns DTOs
   * @param {string} accessToken - Access token
   * @param {string} userId - User ID
   * @returns {Promise<TransactionDTO[]>} Initial transaction DTOs
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
        // Convert to DTOs
        const transactionDTOs = TransactionMapper.toDTOArray(savedTransactions);
        transactions.push(...transactionDTOs);
      }

      offset += newTransactions.length;

      if (transactions.length >= response.data.total_transactions) break;
    }

    return transactions;
  }

  /**
   * Get accounts for user (returns models with PlaidItem included)
   * @param {string} userId - User ID
   * @returns {Promise<Account[]>} User account models with PlaidItem included
   */
  async getAccountsByUser(userId) {
    // Use the repository but include the PlaidItem relationship
    const accounts = await this.accountRepo.findByUser(userId);
    
    // The findByUser method already includes PlaidItem, but let's make sure
    // we have the institution name available
    return accounts;
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
    
    // Exchange for access token and create item
    const result = await this.exchangePublicToken(
      sandboxResponse.data.public_token,
      { institution: { name: 'Platypus Bank (Sandbox)' } },
      userId
    );
    
    // Immediately trigger a manual sync after everything is set up
    setTimeout(async () => {
      try {
        console.log('Starting manual sandbox sync...');
        await this.syncUserTransactions(userId);
        console.log('Manual sandbox sync completed');
      } catch (error) {
        console.error('Manual sandbox sync failed:', error);
      }
    }, 7000); // Even longer delay for sandbox

    return result;
    
  } catch (error) {
    console.error('Sandbox error:', error.response?.data || error.message);
    throw error;
  }
}
  // Private helper methods remain the same...

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