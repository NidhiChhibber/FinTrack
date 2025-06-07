// routes/api/transaction/transaction.js
import express from 'express';
import { TransactionController } from '../../../src/controllers/TransactionController.js';

const router = express.Router();
const transactionController = new TransactionController();

// GET /api/transactions - get all transactions with filters
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/by-plaid-id/:plaidId - get transaction by Plaid ID
router.get('/by-plaid-id/:plaidId', transactionController.getTransactionByPlaidId);

// POST /api/transactions - create new transaction
router.post('/', transactionController.createTransaction);

// PUT /api/transactions/:id - update transaction
router.put('/:id', transactionController.updateTransaction);

// PUT /api/transactions/by-plaid-id/:plaidId - update transaction category
router.put('/by-plaid-id/:plaidId', transactionController.updateTransactionCategory);

// DELETE /api/transactions/by-plaid-id/:plaidId - delete transaction
router.delete('/by-plaid-id/:plaidId', transactionController.deleteTransactionByPlaidId);

export default router;