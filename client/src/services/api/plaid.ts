import { getAuthHeaders } from './authToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const plaidService = {
  async createLinkToken(): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to create link token');
    }
    return data.data.linkToken;
  },

  async exchangePublicToken(publicToken: string, institutionId: string, institutionName: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/plaid/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ publicToken, institutionId, institutionName }),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to exchange token');
    }
  },

  async syncTransactions(): Promise<{ added: number; modified: number; removed: number }> {
    const response = await fetch(`${BASE_URL}/api/plaid/sync_transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to sync transactions');
    }
    return data.data;
  },
};
