import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '../services/api/transactions';
import type { TransactionDTO, TransactionFilters } from '../types';

export interface UseTransactionsOptions extends TransactionFilters {
  limit?: number;
  page?: number;
  accountId?: string;
}

export const useTransactions = (
  options: UseTransactionsOptions = {},
  userId: string = 'user-id'
) => {
  return useQuery({
    queryKey: ['transactions', userId, options],
    queryFn: async () => {
      const { limit = 100, page = 1, accountId, ...filters } = options;
      
      // If accountId is provided, add it to filters
      const finalFilters = accountId ? { ...filters, accountId } : filters;
      
      const result = await transactionsService.getTransactions(finalFilters, { limit, page });
      return result.data; // Return just the data array
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId, // Only run if userId is provided
  });
};

export const useTransactionsByDateRange = (
  startDate: string,
  endDate: string,
  userId: string = 'user-id'
) => {
  return useTransactions({ startDate, endDate }, userId);
};