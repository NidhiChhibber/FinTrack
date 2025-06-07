import db from '../models/index.js';

export const createItemAndAccounts = async ({ userId, accessToken, itemId, institutionName, accounts }) => {
  const plaidItem = await db.PlaidItem.create({
    user_id: userId,
    access_token: accessToken,
    item_id: itemId,
    institution_name: institutionName
  });

  for (const acct of accounts) {
    await db.PlaidAccount.create({
      plaid_item_id: plaidItem.id,
      account_id: acct.account_id,
      name: acct.name,
      mask: acct.mask,
      type: acct.type,
      subtype: acct.subtype,
      official_name: acct.official_name
    });
  }

  return plaidItem;
};


export async function getAccessTokenAndCursor(userId) {
  const record = await db.PlaidItem.findOne({ where: { user_id: userId } });
  return { access_token: record?.access_token, cursor: record?.cursor };
}

export const getAllAccountsByUser = async (userId) => {
  return await db.PlaidAccount.findAll({
    include: [
      {
        model: db.PlaidItem,
        where: { user_id: userId },
        attributes: ['institution_name', 'item_id', 'id']
      }
    ],
    attributes: [
      'account_id',
      'name',
      'mask',
      'type',
      'subtype',
      'official_name'
    ]
  });
};
