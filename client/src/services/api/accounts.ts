// client/src/services/api/accounts.ts
import { apiClient } from './client';
import type { Account } from '../../types';

export interface AccountsResponse {
  success: boolean;
  data: Account[];
}

export interface AccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  accountCount: number;
  byType: {
    checking: number;
    savings: number;
    credit: number;
    investment: number;
    loan: number;
  };
}

export const accountsService = {
  /**
   * Get all accounts for a user
   */
  async getAccounts(userId: string = 'user-id'): Promise<Account[]> {
    const response = await apiClient.get<AccountsResponse>(`/api/plaid/accounts/${userId}`);
    
    // Transform the response to match frontend expectations
    const accounts = response.data.data || [];
    return accounts.map(account => ({
      ...account,
      // Map accountId to plaidAccountId for backwards compatibility
      plaidAccountId: account.accountId,
      // Add institutionName from plaidItem (will need server support)
      institutionName: account.institutionName || 'Unknown Institution'
    }));
  },

  /**
   * Get account summary/totals
   */
  async getAccountSummary(userId: string = 'user-id'): Promise<AccountSummary> {
    try {
      const accounts = await this.getAccounts(userId);
      
      let totalAssets = 0;
      let totalLiabilities = 0;
      const byType = {
        checking: 0,
        savings: 0,
        credit: 0,
        investment: 0,
        loan: 0
      };

      accounts.forEach(account => {
        const balance = account.balance || 0;
        
        // Calculate assets vs liabilities
        if (['checking', 'savings', 'investment'].includes(account.accountType)) {
          totalAssets += balance;
        } else if (['credit', 'loan'].includes(account.accountType)) {
          totalLiabilities += Math.abs(balance);
        }

        // Sum by account type
        if (account.accountType in byType) {
          byType[account.accountType as keyof typeof byType] += balance;
        }
      });

      return {
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
        accountCount: accounts.length,
        byType
      };
    } catch (error) {
      console.error('Error calculating account summary:', error);
      throw error;
    }
  },

  /**
   * Refresh account balances
   */
  async refreshAccounts(userId: string = 'user-id'): Promise<{ message: string }> {
    const response = await apiClient.post('/api/plaid/sync_transactions', {
      userId // Send as camelCase to match DTO
    });
    return response.data;
  },

  /**
   * Update account display preferences
   */
  async updateAccountPreferences(
    accountId: string, 
    preferences: {
      displayName?: string;
      color?: string;
      isHidden?: boolean;
    }
  ): Promise<Account> {
    const response = await apiClient.put(`/api/accounts/${accountId}/preferences`, preferences);
    return response.data.data;
  }
};