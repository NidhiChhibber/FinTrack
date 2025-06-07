import db from '../models/index.js';

// CREATE
export const insertTransaction = async (data) => {
  return await db.Transaction.create(data);
};

// READ all
export const fetchAllTransactions = async () => {
  return await db.Transaction.findAll({
    order: [['date', 'DESC']],
  });
};

// READ one
export const fetchTransactionById = async (id) => {
  return await db.Transaction.findByPk(id);
};

// UPDATE
export const updateTransactionById = async (id, data) => {
  const transaction = await db.Transaction.findByPk(id);
  if (!transaction) return null;

  await transaction.update(data);
  return transaction;
};

// DELETE
export const deleteTransactionById = async (id) => {
  const transaction = await db.Transaction.findByPk(id);
  if (!transaction) return null;

  await transaction.destroy();
  return true;
};
