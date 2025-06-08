export { TransactionMapper } from './TransactionMapper.js';
export { AccountMapper } from './AccountMapper.js';
export { PlaidItemMapper } from './PlaidItemMapper.js';

// Updated src/controllers/TransactionController.js
import { TransactionService } from '../services/TransactionService.js';
import { TransactionMapper } from '../mappers/TransactionMapper.js';
import { ValidationUtils } from '../utils/ValidationUtils.js';

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
      const { startDate, endDate, page = 1, limit = 50, ...otherFilters } = req.query;
      const userId = req.user?.id || 'user-id'; // TODO: Get from auth middleware

      // Validate pagination
      const paginationValidation = ValidationUtils.validatePagination({ page, limit });
      if (!paginationValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters',
          details: paginationValidation.errors
        });
      }

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      // Add other filters
      Object.keys(otherFilters).forEach(key => {
        if (otherFilters[key]) filters[key] = otherFilters[key];
      });

      const pagination = {
        limit: paginationValidation.limit,
        offset: (paginationValidation.page - 1) * paginationValidation.limit
      };

      const transactions = await this.transactionService.getTransactionsByUser(
        userId, 
        filters, 
        pagination
      );

      const transactionDTOs = TransactionMapper.toDTOArray(transactions);

      res.json({
        success: true,
        data: transactionDTOs,
        pagination: {
          page: paginationValidation.page,
          limit: paginationValidation.limit,
          total: transactionDTOs.length,
          hasMore: transactionDTOs.length === paginationValidation.limit
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
      
      if (!plaidId) {
        return res.status(400).json({
          success: false,
          error: 'Plaid ID is required'
        });
      }

      const transaction = await this.transactionService.getTransactionByPlaidId(plaidId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      const transactionDTO = TransactionMapper.toDTO(transaction);

      res.json({
        success: true,
        data: transactionDTO
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
      const transactionRequest = req.body;

      // Validate transaction data
      const validation = ValidationUtils.validateTransaction(transactionRequest);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      // Convert DTO to database format
      const transactionData = TransactionMapper.fromCreateRequest(transactionRequest);
      
      const transaction = await this.transactionService.createTransaction(transactionData);
      const transactionDTO = TransactionMapper.toDTO(transaction);

      res.status(201).json({
        success: true,
        data: transactionDTO
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to create transaction',
        details: error.message
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
      const updateRequest = req.body;

      if (!id || !updateRequest || Object.keys(updateRequest).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Transaction ID and update data are required'
        });
      }

      // Convert DTO to database format
      const updateData = TransactionMapper.fromUpdateRequest(updateRequest);

      const transaction = await this.transactionService.updateTransaction(id, updateData);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      const transactionDTO = TransactionMapper.toDTO(transaction);

      res.json({
        success: true,
        data: transactionDTO
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update transaction',
        details: error.message
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
      const { category, transactionType } = req.body; // Note: camelCase from client

      if (!plaidId || !category) {
        return res.status(400).json({
          success: false,
          error: 'Plaid ID and category are required'
        });
      }

      // Convert to database format
      const updates = { category };
      if (transactionType) {
        updates.transaction_type = transactionType;
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

      const transactionDTO = TransactionMapper.toDTO(transaction);

      res.json({
        success: true,
        data: transactionDTO
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
      
      if (!plaidId) {
        return res.status(400).json({
          success: false,
          error: 'Plaid ID is required'
        });
      }

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