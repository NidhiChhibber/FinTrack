// client/src/pages/Accounts.tsx
import React from 'react';
import { Plus, CreditCard, Landmark, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAccounts, useAccountSummary, useSyncTransactions } from '../hooks/useAccounts';
import { AccountSummaryCard } from '../components/accounts/AccountSummaryCard';
import { AccountCard } from '../components/accounts/AccountCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PageHeader } from '../components/common/PageHeader';

export const Accounts: React.FC = () => {
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { data: summary, isLoading: summaryLoading } = useAccountSummary();
  const refreshAccounts = useSyncTransactions();

  const handleRefresh = () => {
    refreshAccounts.mutate('custom_dnc_user'); // Use consistent user ID
  };

  const handleAddAccount = () => {
  };

  if (accountsLoading || summaryLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Accounts" 
          description="Loading your accounts..." 
        />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading accounts..." />
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Accounts" 
          description="Error loading accounts. Please try again."
        >
          <Button onClick={handleRefresh} disabled={refreshAccounts.isPending}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </PageHeader>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Accounts" 
        description="Manage your connected bank accounts and balances"
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshAccounts.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshAccounts.isPending ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={handleAddAccount}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </PageHeader>

      {/* Account Summary */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <AccountSummaryCard
            title="Total Assets"
            amount={summary.totalAssets}
            description="Checking + Savings + Investments"
            icon={Landmark}
            iconColor="text-blue-500"
          />
          <AccountSummaryCard
            title="Total Debt"
            amount={summary.totalLiabilities}
            description="Credit Cards + Loans"
            icon={CreditCard}
            iconColor="text-red-500"
          />
          <AccountSummaryCard
            title="Net Worth"
            amount={summary.netWorth}
            description="Assets - Liabilities"
            icon={TrendingUp}
            iconColor="text-green-500"
          />
        </div>
      )}

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
        
        {accounts && accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No accounts connected"
            description="Connect your bank accounts to start tracking your finances"
            actionLabel="Connect Your First Account"
            onAction={handleAddAccount}
          />
        )}
      </div>
    </div>
  );
};