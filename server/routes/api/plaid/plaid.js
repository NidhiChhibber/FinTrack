// routes/api/plaid/plaid.js
import express from 'express';
import { PlaidController } from '../../../src/controllers/PlaidController.js';

const router = express.Router();
const plaidController = new PlaidController();

// POST /api/plaid/create_link_token - create link token for Plaid Link
router.post('/create_link_token', plaidController.createLinkToken);

// POST /api/plaid/exchange_public_token - exchange public token for access token
router.post('/exchange_public_token', plaidController.exchangePublicToken);

// GET /api/plaid/accounts/:userId - get accounts for user
router.get('/accounts/:userId', plaidController.getAccounts);

// POST /api/plaid/sync_transactions - sync transactions for user
router.post('/sync_transactions', plaidController.syncTransactions);

// POST /api/plaid/sandbox_auto_connect - create sandbox connection (for testing)
router.post('/sandbox_auto_connect', plaidController.sandboxAutoConnect);

export default router;