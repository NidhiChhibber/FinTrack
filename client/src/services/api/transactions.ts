// client/src/services/api/transactions.ts
import type { TransactionDTO, TransactionFilters } from '../../types';
import { getAuthHeaders } from './authToken';

export interface TransactionsResponse {
  success: boolean;
  data: TransactionDTO[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

class TransactionsService {
  private baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  async getTransactions(filters: TransactionFilters = {}, pagination = { page: 1, limit: 50 }): Promise<TransactionsResponse> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => params.append('category', cat));
    }
    if (filters.accountTypes && filters.accountTypes.length > 0) {
      filters.accountTypes.forEach(type => params.append('accountType', type));
    }
    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      filters.transactionTypes.forEach(type => params.append('transactionType', type));
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.merchantName) params.append('merchantName', filters.merchantName);
    if (filters.minAmount !== undefined) params.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount !== undefined) params.append('maxAmount', filters.maxAmount.toString());
    if (filters.excludeTransfers) params.append('excludeTransfers', 'true');
    if (filters.onlyRecurring) params.append('onlyRecurring', 'true');
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    const response = await fetch(`${this.baseURL}/api/transactions?${params}`, {
      headers: await getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: data.success || true,
      data: data.data || [],
      pagination: data.pagination
    };
  }

  async updateTransactionCategory(plaidId: string, category: string, transactionType?: string): Promise<TransactionDTO> {
    const response = await fetch(`${this.baseURL}/api/transactions/by-plaid-id/${plaidId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        category,
        ...(transactionType && { transaction_type: transactionType })
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update transaction');
    }
    
    return data.data;
  }
}

export const transactionsService = new TransactionsService(); 
