import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import dotenv from "dotenv"
import { getPrimaryPlaidItemForUser, updateCursorForItem } from "./plaid-item.service.js";
import { categorizeTransaction } from "./category-service.js";
import { saveOrUpdateTransactions } from "./transaction.service.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

// export async function getAndStoreInitialTransactions(access_token, userId, accountIds) {
//   let transactions = [];
//   let offset = 0;
//   const count = 500;
//   const start_date = '2020-06-01';
//   const end_date = new Date().toISOString().split("T")[0];

//   while (true) {
//     const response = await plaidClient.transactionsGet({
//       access_token,
//       start_date,
//       end_date,
//       options: { count: count,offset: offset,  account_ids: accountIds}
//     });
//     // console.log("RESPONSE:", response);
    

//     const newTxns = response.data.transactions;
//     for (const tx of newTxns) {
//       console.log(`Got tx for account_id: ${tx.account_id}`);
//     }

//     // ML categorize each transaction
//     // for (const txn of newTxns) {
//     //   txn.category = await categorizeTransaction(txn.name);
//     // }

//     const plaidItem = await getPrimaryPlaidItemForUser(userId);

//     // console.log("RESPONSE", response.data.transactions.length, response.data.total_transactions);


//     await saveOrUpdateTransactions(newTxns, plaidItem);

//     transactions.push(...newTxns);
//     offset += newTxns.length;

//     if (transactions.length >= response.data.total_transactions) break;
//   }

//   return transactions;
// }

export async function syncUserTransactions(userId) {
  const plaidItem = await getPrimaryPlaidItemForUser(userId);
  if (!plaidItem?.access_token) throw new Error("No access token found");

  let cursor = plaidItem.cursor || null;
  let allNew = [];
  let hasMore = true;

  while (hasMore) {
    const { added, next_cursor, has_more } = await transactionsSync(plaidItem.access_token, cursor);

    // for (const txn of added) {
    //   txn.category = await categorizeTransaction(txn.name);
    // }

  console.log('Numb:', added);


    await saveOrUpdateTransactions(added, plaidItem);
    allNew.push(...added);
    cursor = next_cursor;
    hasMore = has_more;
  }

  await updateCursorForItem(plaidItem.item_id, cursor);
  return allNew;
}

export async function transactionsSync(accessToken, cursor) {
  const response = await plaidClient.transactionsSync({
    access_token: accessToken,
    cursor,
  });
  const { added, modified, removed, next_cursor, has_more } = response.data;
  return { added, modified, removed, next_cursor, has_more };
}

export const plaidClient = new PlaidApi(config);

// Add this *after* creating the Plaid client
// plaidClient.axios.interceptors.request.use((config) => {
//   console.log('📤 [Plaid Request]', {
//     method: config.method,
//     url: config.url,
//     data: config.data,
//     headers: config.headers,
//   });
//   return config;
// });

// plaidClient.axios.interceptors.response.use((response) => {
//   console.log('📥 [Plaid Response]', {
//     url: response.config.url,
//     status: response.status,
//     data: response.data,
//   });
//   return response;
// }, (error) => {
//   if (error.response) {
//     console.error('❌ [Plaid Error Response]', {
//       url: error.response.config.url,
//       status: error.response.status,
//       data: error.response.data,
//     });
//   } else {
//     console.error('❌ [Plaid Error]', error.message);
//   }
//   return Promise.reject(error);
// });

