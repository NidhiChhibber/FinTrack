// client/src/services/api/transactions.ts
import { apiClient } from './client';
import type { Transaction, TransactionFilters } from '../../types';

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const transactionsService = {
  async getTransactions(filters: TransactionFilters = {}, pagination = { page: 1, limit: 50 }): Promise<TransactionsResponse> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);
    if (filters.accountType) params.append('accountType', filters.accountType);
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.search) params.append('search', filters.search);
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    const response = await apiClient.get<TransactionsResponse>(`/api/transactions?${params}`);
    return response.data;
  },

  async updateTransactionCategory(plaidId: string, category: string, transactionType?: string): Promise<Transaction> {
    const response = await apiClient.put(`/api/transactions/by-plaid-id/${plaidId}`, {
      category,
      transactionType
    });
    return response.data.data;
  }
};