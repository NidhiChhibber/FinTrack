import { useState, useCallback } from 'react';
import { usePlaidLink as usePlaidLinkLib, PlaidLinkOptions } from 'react-plaid-link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plaidService } from '../services/api/plaid';

export const usePlaidLink = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const exchangeToken = useMutation({
    mutationFn: async ({ publicToken, institutionId, institutionName }: {
      publicToken: string;
      institutionId: string;
      institutionName: string;
    }) => {
      await plaidService.exchangePublicToken(publicToken, institutionId, institutionName);
      await plaidService.syncTransactions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const fetchLinkToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await plaidService.createLinkToken();
      setLinkToken(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize Plaid');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      const institution = metadata.institution;
      if (institution) {
        exchangeToken.mutate({
          publicToken,
          institutionId: institution.institution_id,
          institutionName: institution.name,
        });
      }
    },
    onExit: (err) => {
      if (err) {
        setError(err.display_message || 'Plaid connection cancelled');
      }
    },
  };

  const { open, ready } = usePlaidLinkLib(config);

  const openPlaidLink = useCallback(async () => {
    if (!linkToken) {
      await fetchLinkToken();
    }
    if (ready) {
      open();
    }
  }, [linkToken, fetchLinkToken, ready, open]);

  return {
    openPlaidLink,
    isLoading: isLoading || exchangeToken.isPending,
    error,
    ready: ready && !!linkToken,
    fetchLinkToken,
  };
};
