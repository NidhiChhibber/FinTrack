import db from '../models/index.js';
import {
  insertTransaction,
  fetchTransactionById,
  updateTransactionById,
  deleteTransactionById
} from '../db/transaction.queries.js';

// Helper: Convert DB entity to DTO
function toTransactionDTO(tx) {
  return {
    plaidId: tx.plaid_id,
    name: tx.name,
    amount: tx.amount,
    date: tx.date,
    category: tx.category,
    merchantName: tx.merchant_name,
  };
}

// Create transaction
export const createTransaction = async (data) => {
  const created = await insertTransaction(data);
  return toTransactionDTO(created);
};

// Get all with optional filters
export async function getAllTransactions(whereClause = {}) {
  const txs = await db.Transaction.findAll({
    where: whereClause,
    order: [['date', 'DESC']],
  });
  return txs.map(toTransactionDTO);
};

// Get by numeric ID
export const getTransactionById = async (id) => {
  const tx = await fetchTransactionById(id);
  return tx ? toTransactionDTO(tx) : null;
};

// Get by plaid_id (string ID)
export const getTransactionByPlaidId = async (plaidId) => {
  const tx = await db.Transaction.findOne({ where: { plaid_id: plaidId } });
  return tx ? toTransactionDTO(tx) : null;
};

// Update by numeric ID
export const updateTransaction = async (id, data) => {
  const updated = await updateTransactionById(id, data);
  return updated ? toTransactionDTO(updated) : null;
};

// Update only the category using plaid_id
export const updateTransactionCategoryByPlaidId = async (plaidId, category) => {
  const tx = await db.Transaction.findOne({ where: { plaid_id: plaidId } });
  if (!tx) return null;
  tx.category = category;
  tx.category_corrected = true;
  await tx.save();
  return toTransactionDTO(tx);
};

// Delete by numeric ID
export const deleteTransaction = async (id) => {
  return await deleteTransactionById(id);
};

// Delete by plaid_id
export const deleteTransactionByPlaidId = async (plaidId) => {
  return await db.Transaction.destroy({ where: { plaid_id: plaidId } });
};

// Save or update a list of transactions during Plaid sync
export const saveOrUpdateTransactions = async (transactions, plaidItem) => {
  const saved = [];

  // console.log("Num of Tranx To Add:", transactions.length);
  for (const tx of transactions) {
    // console.log("Adding TRANX:", tx.name);
    const account = await db.PlaidAccount.findOne({
      where: {
        account_id: tx.account_id,
        plaid_item_id: plaidItem.id,
      },
    });

    if (!account) {
      // console.warn(`Account not found for ${tx.name}, skipping transaction`);
      continue;
    }

    const [existing, created] = await db.Transaction.findOrCreate({
      where: { plaid_id: tx.transaction_id },
      defaults: {
        name: tx.name,
        amount: tx.amount,
        date: tx.date,
        category: tx.category?.[0] || 'Uncategorized',
        merchant_name: tx.merchant_name || '',
        plaid_id: tx.transaction_id,
        plaid_item_id: plaidItem.id,
        plaid_account_id: account.id,
      },
    });

    if (!created) {
      await existing.update({
        name: tx.name,
        amount: tx.amount,
        date: tx.date,
        category: tx.category?.[0] || 'Uncategorized',
        merchant_name: tx.merchant_name || '',
        plaid_account_id: account.id,
        plaid_item_id: plaidItem.id,
      });
      saved.push(toTransactionDTO(existing));
    } else {
      saved.push(toTransactionDTO(existing));
    }
  }

  return saved;
};
