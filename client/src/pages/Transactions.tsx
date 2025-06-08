// client/src/pages/Transactions.tsx
import React, { useState } from 'react';
import { Filter, Search, Download } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { TransactionFilters } from '../types';

export const Transactions: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data: transactionsResponse, isLoading, error } = useTransactions(filters);

  const transactions = transactionsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transactions" description="Loading transactions..." />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading transactions..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transactions" description="Error loading transactions" />
        <div className="text-center text-red-500">Failed to load transactions</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transactions" 
        description="View and manage all your transactions"
      >
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </PageHeader>

      {transactions.length > 0 ? (
        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transactionType === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.category?.[0] || 'T'}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.account?.name}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transactionType === 'income' ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.normalizedAmount))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.merchantName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No transactions found"
          description="Connect your accounts to start tracking transactions"
          actionLabel="Connect Account"
          onAction={() => console.log('Connect account')}
        />
      )}
    </div>
  );
};