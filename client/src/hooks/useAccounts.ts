import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/api/accounts';
import type { Account } from '../types';

// Query keys for React Query
export const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (userId: string) => [...accountsKeys.lists(), userId] as const,
  summary: (userId: string) => [...accountsKeys.all, 'summary', userId] as const,
};

/**
 * Hook to fetch user accounts
 */
export const useAccounts = (userId?: string) => {
  const actualUserId = userId || 'custom_dnc_user';
  
  return useQuery({
    queryKey: accountsKeys.list(actualUserId),
    queryFn: () => accountsService.getAccounts(actualUserId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!actualUserId, // Only run query if we have a user ID
  });
};

/**
 * Hook to fetch account summary/totals
 */
export const useAccountSummary = (userId?: string) => {
  const actualUserId = userId || 'custom_dnc_user';
  
  return useQuery({
    queryKey: accountsKeys.summary(actualUserId),
    queryFn: () => accountsService.getAccountSummary(actualUserId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!actualUserId, // Only run query if we have a user ID
  });
};

/**
 * Hook to refresh account data
 */
export const useRefreshAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId?: string) => {
      const actualUserId = userId || 'custom_dnc_user';
      return accountsService.refreshAccounts(actualUserId);
    },
    onSuccess: (data, userId) => {
      const actualUserId = userId || 'custom_dnc_user';
      // Invalidate and refetch accounts data
      queryClient.invalidateQueries({ queryKey: accountsKeys.list(actualUserId) });
      queryClient.invalidateQueries({ queryKey: accountsKeys.summary(actualUserId) });
      
      // Also invalidate transactions since they might have updated
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Failed to refresh accounts:', error);
    },
  });
};

/**
 * Hook to update account preferences
 */
export const useUpdateAccountPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      accountId, 
      preferences 
    }: {
      accountId: string;
      preferences: {
        displayName?: string;
        color?: string;
        isHidden?: boolean;
      };
    }) => accountsService.updateAccountPreferences(accountId, preferences),
    onSuccess: (updatedAccount, { accountId }) => {
      // Update the account in all relevant queries
      queryClient.setQueryData<Account[]>(
        accountsKeys.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(account => 
            account.id === accountId ? updatedAccount : account
          );
        }
      );

      // Invalidate summary to recalculate totals
      queryClient.invalidateQueries({ queryKey: accountsKeys.all });
    },
    onError: (error) => {
      console.error('Failed to update account preferences:', error);
    },
  });
};