import db from '../models/index.js';

export async function getPrimaryPlaidItemForUser(userId) {
  const result = await db.PlaidItem.findOne({ where: { user_id: userId } });
  return result;
}

export async function getAllPlaidItemsForUser(userId) {
  return await db.PlaidItem.findAll({ where: { user_id: userId } });
}

export async function updateCursorForItem(itemId, newCursor) {
  return await db.PlaidItem.update(
    { cursor: newCursor },
    { where: { item_id: itemId } }
  );
}
