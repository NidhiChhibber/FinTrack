import { PlaidService } from '../services/PlaidService.js';
import { AccountMapper, PlaidItemMapper } from '../mappers/index.js';

export class PlaidController {
  constructor() {
    this.plaidService = new PlaidService();
  }

  /**
   * Create link token for Plaid Link
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  createLinkToken = async (req, res) => {
    try {
      const userId = req.user?.id || 'user-id'; // TODO: Get from auth middleware
      const linkToken = await this.plaidService.createLinkToken(userId);

      res.json({
        success: true,
        data: {
          linkToken: linkToken.link_token,
          expiration: linkToken.expiration,
          requestId: linkToken.request_id
        }
      });
    } catch (error) {
      console.error('Error creating link token:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create link token'
      });
    }
  };

  /**
   * Exchange public token for access token
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  exchangePublicToken = async (req, res) => {
    try {
      const { publicToken, metadata } = req.body; // Note: camelCase from client
      const userId = req.user?.id || 'user-id'; // TODO: Get from auth middleware

      if (!publicToken) {
        return res.status(400).json({
          success: false,
          error: 'Public token is required'
        });
      }

      const result = await this.plaidService.exchangePublicToken(
        publicToken, 
        metadata, 
        userId
      );

      // Start initial transaction sync in background
      setTimeout(() => {
        this.plaidService.getInitialTransactions(
          result.plaidItem.access_token, 
          userId
        ).catch(console.error);
      }, 2000);

      res.json({
        success: true,
        data: {
          itemId: result.plaidItem.item_id,
          accountsLinked: result.accountCount,
          institution: metadata?.institution?.name,
          accounts: AccountMapper.toDTOArray(result.accounts || [])
        }
      });
    } catch (error) {
      console.error('Error exchanging public token:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to exchange token'
      });
    }
  };

  /**
   * Get user accounts
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  getAccounts = async (req, res) => {
    try {
      const userId = req.params.userId || req.user?.id || 'user-id';
      const accounts = await this.plaidService.getAccountsByUser(userId);

      const accountDTOs = AccountMapper.toDTOArray(accounts);

      res.json({
        success: true,
        data: accountDTOs,
        meta: {
          totalAccounts: accountDTOs.length,
          activeAccounts: accountDTOs.filter(acc => acc.isActive).length
        }
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch accounts'
      });
    }
  };

  /**
   * Sync transactions for user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  syncTransactions = async (req, res) => {
    try {
      const { userId } = req.body; // Note: camelCase from client
      const finalUserId = userId || req.user?.id || 'user-id';

      if (!finalUserId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const newTransactions = await this.plaidService.syncUserTransactions(finalUserId);
      const transactionDTOs = TransactionMapper.toDTOArray(newTransactions);

      res.json({
        success: true,
        data: {
          transactionsSynced: transactionDTOs.length,
          transactions: transactionDTOs
        }
      });
    } catch (error) {
      console.error('Error syncing transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync transactions'
      });
    }
  };

  /**
   * Create sandbox connection (for testing)
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  sandboxAutoConnect = async (req, res) => {
    try {
      const userId = req.user?.id || 'custom_dnc_user'; // TODO: Get from auth middleware

      const result = await this.plaidService.createSandboxConnection(userId);

      res.json({
        success: true,
        data: {
          itemId: result.plaidItem.item_id,
          accountsLinked: result.accountCount,
          institution: 'Platypus Bank (Sandbox)',
          message: 'Sandbox connection created successfully',
          accounts: AccountMapper.toDTOArray(result.accounts || [])
        }
      });
    } catch (error) {
      console.error('Sandbox auto connect failed:', error);
      res.status(500).json({
        success: false,
        error: 'Sandbox connection failed'
      });
    }
  };
}