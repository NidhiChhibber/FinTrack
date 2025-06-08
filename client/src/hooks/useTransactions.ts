import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/api/dashboard';
import type { TransactionDTO } from '../types';

export interface UseTransactionsOptions {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export const useTransactions = (
  options: UseTransactionsOptions = {},
  userId: string = 'user-id'
) => {
  return useQuery({
    queryKey: ['transactions', userId, options],
    queryFn: () => dashboardService.getTransactions(userId, options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime in v3)
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