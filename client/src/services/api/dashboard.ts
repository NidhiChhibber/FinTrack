// client/src/services/api/dashboard.ts
import { ApiClient } from './client';
import type { TransactionDTO, AccountDTO, AccountSummary } from '../../types';

class DashboardService {
  private client = new ApiClient();

  async getTransactions(userId: string): Promise<TransactionDTO[]> {
    const response = await this.client.get<TransactionDTO[]>(`/transactions`);
    return Array.isArray(response.data) ? response.data : [];
  }

  async getAccounts(userId: string): Promise<AccountDTO[]> {
    const response = await this.client.get<AccountDTO[]>(`/plaid/accounts/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
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
    const response = await this.client.post('/plaid/sync_transactions', { userId });
    return response.data;
  }
}

export const dashboardService = new DashboardService();