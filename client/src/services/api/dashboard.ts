// client/src/services/api/dashboard.ts - Fixed API paths
import type { TransactionDTO, AccountDTO, AccountSummary } from '../../types';
import { getAuthHeaders } from './authToken';

class DashboardService {
  private baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  async getTransactions(userId: string, options: any = {}): Promise<TransactionDTO[]> {
    const params = new URLSearchParams();
    
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.limit) params.append('limit', options.limit.toString());
    
    const response = await fetch(`${this.baseURL}/api/transactions?${params}`, {
      headers: await getAuthHeaders(),
    });
    const data = await response.json();
    
    return Array.isArray(data.data) ? data.data : [];
  }

  async getAccounts(userId: string): Promise<AccountDTO[]> {
    const response = await fetch(`${this.baseURL}/api/plaid/accounts/${userId}`, {
      headers: await getAuthHeaders(),
    });
    const data = await response.json();
    
    return Array.isArray(data.data) ? data.data : [];
  }

  async getAccountSummary(accounts: AccountDTO[]): Promise<AccountSummary> {
    let totalAssets = 0;
    let totalLiabilities = 0;
    const breakdown = { checking: 0, savings: 0, credit: 0, investment: 0, loan: 0 };

    accounts.forEach(account => {
      const balance = account.balance || 0;
      breakdown[account.accountType as keyof typeof breakdown] += balance;
      
      if (account.accountType === 'credit' || account.accountType === 'loan') {
        totalLiabilities += Math.abs(balance);
      } else {
        totalAssets += balance;
      }
    });

    return {
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
      accountBreakdown: breakdown
    };
  }

  async syncTransactions(userId: string) {
    const response = await fetch(`${this.baseURL}/api/plaid/sync_transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    return data.data;
  }
}

export const dashboardService = new DashboardService();
