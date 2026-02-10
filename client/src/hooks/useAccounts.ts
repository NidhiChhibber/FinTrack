import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/api/dashboard';
import { useCurrentUser } from './useCurrentUser';

export const useAccounts = (userId?: string) => {
  const { userId: currentUserId } = useCurrentUser();
  const effectiveUserId = userId || currentUserId;
  return useQuery({
    queryKey: ['accounts', effectiveUserId],
    queryFn: () => dashboardService.getAccounts(effectiveUserId),
  });
};

export const useAccountSummary = (userId?: string) => {
  const { userId: currentUserId } = useCurrentUser();
  const effectiveUserId = userId || currentUserId;
  return useQuery({
    queryKey: ['accountSummary', effectiveUserId],
    queryFn: async () => {
      const accounts = await dashboardService.getAccounts(effectiveUserId);
      return dashboardService.getAccountSummary(accounts);
    },
  });
};

export const useSyncTransactions = () => {
  const queryClient = useQueryClient();
  const { userId } = useCurrentUser();
  
  return useMutation({
    mutationFn: (overrideUserId?: string) => dashboardService.syncTransactions(overrideUserId || userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
    },
  });
};
