import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/api/dashboard';

export const useAccounts = (userId: string = 'user-id') => {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => dashboardService.getAccounts(userId),
  });
};

export const useAccountSummary = (userId: string = 'user-id') => {
  return useQuery({
    queryKey: ['accountSummary', userId],
    queryFn: async () => {
      const accounts = await dashboardService.getAccounts(userId);
      return dashboardService.getAccountSummary(accounts);
    },
  });
};

export const useSyncTransactions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => dashboardService.syncTransactions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
    },
  });
};