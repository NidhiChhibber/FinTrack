// src/controllers/TransactionController.js
import { TransactionService } from '../services/TransactionService.js';

export class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Get all transactions with filters
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  getAllTransactions = async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 50 } = req.query;
      const userId = req.user?.id || 'user-id'; // TODO: Get from auth middleware

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const pagination = {
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      };

      const result = await this.transactionService.getTransactionsByUser(
        userId, 
        filters, 
        pagination
      );

      res.json({
        success: true,
        data: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.length
        }
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transactions'
      });
    }
  };

  /**
   * Get transaction by Plaid ID
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  getTransactionByPlaidId = async (req, res) => {
    try {
      const { plaidId } = req.params;
      const transaction = await this.transactionService.getTransactionByPlaidId(plaidId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transaction'
      });
    }
  };

  /**
   * Create new transaction
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  createTransaction = async (req, res) => {
    try {
      const transactionData = req.body;
      const transaction = await this.transactionService.createTransaction(transactionData);

      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to create transaction'
      });
    }
  };

  /**
   * Update transaction
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const transaction = await this.transactionService.updateTransaction(id, updateData);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update transaction'
      });
    }
  };

  /**
   * Update transaction category by Plaid ID
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  updateTransactionCategory = async (req, res) => {
    try {
      const { plaidId } = req.params;
      const { category, transaction_type } = req.body;

      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Category is required'
        });
      }

      const updates = { category };
      if (transaction_type) {
        updates.transaction_type = transaction_type;
      }

      const transaction = await this.transactionService.updateTransactionCategoryByPlaidId(
        plaidId, 
        updates
      );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error updating transaction category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update category'
      });
    }
  };

  /**
   * Delete transaction by Plaid ID
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  deleteTransactionByPlaidId = async (req, res) => {
    try {
      const { plaidId } = req.params;
      const deleted = await this.transactionService.deleteTransactionByPlaidId(plaidId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete transaction'
      });
    }
  };
}