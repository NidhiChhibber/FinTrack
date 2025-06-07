import express from 'express';
import { plaidClient } from '../../../services/plaid.service.js';
import {getAllAccountsByUser} from '../../../db/plaid.queries.js';
import { createItemAndAccounts } from '../../../db/plaid.queries.js';
import { syncUserTransactions } from '../../../services/plaid.service.js';
// import { getAndStoreInitialTransactions } from '../../../services/plaid.service.js';


const router = express.Router();

// 1. Create link token
router.post('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'finTrack',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error creating link token:', e);
    res.status(500).send('Failed to create link token');
  }
});

router.post('/sandbox_auto_connect', async (req, res) => {
  try {
    const userId = 'custom_dnc_user'; // Replace with real user ID

    // Create sandbox public_token
    const { data: sandbox } = await plaidClient.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // "Platypus Bank"
      initial_products: ['transactions'],
      options: {
        override_username: userId,
      },
    });

    // Exchange for access_token
    const { data: token } = await plaidClient.itemPublicTokenExchange({
      public_token: sandbox.public_token
    });

    const { access_token, item_id } = token;

    const { data: accountsResponse } = await plaidClient.accountsGet({
      access_token
    });

    console.log('Plaid accounts linked:', accountsResponse.accounts.map(a => a.account_id));

    const accountIds = accountsResponse.accounts.map(a => a.account_id);

    await createItemAndAccounts({
      userId,
      accessToken: access_token,
      itemId: item_id,
      institutionName: "Platypus Bank (Sandbox)",
      accounts: accountsResponse.accounts
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    syncUserTransactions(userId)
      .then(() => console.log('Transactions synced in background'))
      .catch((err) => console.error('Sync failed:', err));
    res.json({ access_token, item_id});
  } catch (e) {
    console.error("Sandbox auto connect failed:", e);
    res.status(500).send("Sandbox connection failed");
  }
});


router.post('/exchange_public_token', async (req, res) => {
  try {
    const userId = 'user-id';
    const { public_token, metadata } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;
    const institution_name = metadata?.institution?.name || 'Unknown';

    const account_id = metadata?.accounts?.[0]?.id;
    if (!account_id) {
      console.error('No account_id found in metadata');
      return res.status(400).send('Missing account_id');
    }

    await createItemAndAccounts({
      userId: userId, // replace with real user ID
      accessToken: access_token,
      itemId: item_id,
      institutionName: institution_name,
      accounts: metadata.accounts
    });

    // Fetch and categorize 2 years of data
    const synced = await getAndStoreInitialTransactions(access_token, userId);

    res.json({ access_token, item_id, transactions_saved: synced.length });
  } catch (e) {
    console.error(e);
    res.status(500).send('Token exchange failed');
  }
});

// 4. Get linked accounts
router.get('/accounts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const accounts = await getAllAccountsByUser(userId);
    res.json(accounts);
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to fetch accounts');
  }
});

// 5. Sync latest transactions
// router.post('/sync_transactions', async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     const plaidItem = await getPrimaryPlaidItemForUser(user_id);

//     if (!plaidItem || !plaidItem.access_token) {
//       return res.status(404).json({ error: 'No access token found' });
//     }

//     let cursor = plaidItem.cursor || null;
//     let added = [];
//     let hasMore = true;

//     while (hasMore) {
//       const response = await plaidClient.transactionsSync({
//         access_token: plaidItem.access_token,
//         cursor,
//       });

//       const { added: newAdded, modified, removed, next_cursor, has_more } = response.data;

//       await saveOrUpdateTransactions(newAdded, plaidItem);

//       added = added.concat(newAdded);
//       cursor = next_cursor;
//       hasMore = has_more;
//     }

//     await updateCursorForItem(plaidItem.item_id, cursor);

//     res.json(added);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to sync transactions');
//   }
// });

router.post("/sync_transactions", async (req, res) => {
  try {
    const { user_id } = req.body;
    const newTransactions = await syncUserTransactions(user_id);
    res.json(newTransactions);
  } catch (err) {
    console.error("Sync failed:", err);
    res.status(500).send("Failed to sync transactions");
  }
});




export default router;
