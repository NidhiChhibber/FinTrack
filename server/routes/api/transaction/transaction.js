import express from 'express';
import {
  getAllTransactions,
  getTransactionByPlaidId,
  createTransaction,
  updateTransaction,
  updateTransactionCategoryByPlaidId,
  deleteTransactionByPlaidId,
} from '../../../services/transaction.service.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /api/transactions - get all transactions
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereClause.date = {
        ...(whereClause.date || {}),
        [Op.lte]: new Date(endDate),
      };
    }

    const transactions = await getAllTransactions(whereClause);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch transactions');
  }
});

// GET /api/transactions/by-plaid-id/:plaidId
router.get('/by-plaid-id/:plaidId', async (req, res) => {
  try {
    const transaction = await getTransactionByPlaidId(req.params.plaidId);
    if (!transaction) return res.status(404).send('Transaction not found');
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching transaction');
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const newTransaction = await createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error creating transaction');
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateTransaction(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating transaction');
  }
});

// PUT /api/transactions/by-plaid-id/:plaidId
router.put('/by-plaid-id/:plaidId', async (req, res) => {
  const { plaidId } = req.params;
  const { category } = req.body;

  try {
    const updated = await updateTransactionCategoryByPlaidId(plaidId, category);
    if (!updated) return res.status(404).send('Transaction not found');
    res.json(updated);
  } catch (err) {
    console.error('Failed to update transaction category:', err);
    res.status(500).send('Failed to update category');
  }
});

// DELETE /api/transactions/by-plaid-id/:plaidId
router.delete('/by-plaid-id/:plaidId', async (req, res) => {
  try {
    const deleted = await deleteTransactionByPlaidId(req.params.plaidId);
    if (!deleted) return res.status(404).send('Transaction not found');
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting transaction');
  }
});

export default router;
