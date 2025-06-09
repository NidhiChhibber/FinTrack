// client/src/pages/Transactions.tsx - Enhanced with working date range picker
import React, { useState, useMemo } from 'react';
import { Filter, Search, Download, Calendar, ArrowUpDown } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { Button } from '../components/ui/button';
import { Badge, ConfidenceBadge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { CategorySelect } from '../components/transactions/CategorySelect';
import { AccountFilter } from '../components/transactions/AccountFilter';
import { DateRangePicker } from '../components/transactions/DateRangePicker';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import { formatCurrency, formatDate } from '../utils/formatters';
import { transactionsService } from '../services/api/transactions';
import type { TransactionDTO, TransactionFilters } from '../types';

export const Transactions: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  // Build filters object
  const filters: TransactionFilters = useMemo(() => {
    const baseFilters: TransactionFilters = {};
    
    if (startDate) baseFilters.startDate = startDate;
    if (endDate) baseFilters.endDate = endDate;
    if (selectedAccountId) baseFilters.accountId = selectedAccountId;
    if (searchTerm) baseFilters.search = searchTerm;
    
    return baseFilters;
  }, [startDate, endDate, selectedAccountId, searchTerm]);

  // Fetch data
  const { data: accounts } = useAccounts();
  const { data: transactions, isLoading, error, refetch } = useTransactions(filters);

  // Handle date range change
  const handleDateRangeChange = (newStartDate?: string, newEndDate?: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Handle category update
  const handleCategoryUpdate = async (plaidId: string, category: string) => {
    try {
      await transactionsService.updateTransactionCategory(plaidId, category);
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  // Get transaction type badge variant
  const getTransactionTypeBadge = (transaction: TransactionDTO) => {
    if (transaction.transactionType === 'income') {
      return <Badge variant="success">Income</Badge>;
    } else if (transaction.transactionType === 'expense') {
      return <Badge variant="destructive">Expense</Badge>;
    } else if (transaction.transactionType === 'transfer') {
      return <Badge variant="info">Transfer</Badge>;
    }
    return <Badge variant="secondary">{transaction.transactionType}</Badge>;
  };

  // Get amount styling
  const getAmountStyling = (transaction: TransactionDTO) => {
    if (transaction.transactionType === 'income') {
      return 'text-green-600 font-semibold';
    } else if (transaction.transactionType === 'expense') {
      return 'text-red-600 font-semibold';
    }
    return 'text-foreground font-semibold';
  };

  // Calculate stats for current filtered transactions
  const stats = useMemo(() => {
    if (!transactions) return { total: 0, income: 0, expenses: 0, aiCategorized: 0 };
    
    return {
      total: transactions.length,
      income: transactions
        .filter(tx => tx.transactionType === 'income')
        .reduce((sum, tx) => sum + Math.abs(tx.normalizedAmount), 0),
      expenses: transactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.normalizedAmount), 0),
      aiCategorized: transactions.filter(tx => tx.categorySource === 'ai').length
    };
  }, [transactions]);

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
        description="View and manage all your transactions with AI-powered categorization"
      >
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AccountFilter
          accounts={accounts || []}
          selectedAccountId={selectedAccountId}
          onAccountChange={setSelectedAccountId}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Transactions</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Income</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.income)}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Expenses</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.expenses)}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">AI Categorized</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.aiCategorized}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {transactions && transactions.length > 0 ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date, 'short')}
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      {transaction.merchantName && (
                        <div className="text-xs text-muted-foreground">
                          {transaction.merchantName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <CategorySelect
                      currentCategory={transaction.category}
                      transactionId={transaction.id.toString()}
                      plaidId={transaction.plaidId}
                      onCategoryChange={handleCategoryUpdate}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{transaction.account?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.accountType}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getTransactionTypeBadge(transaction)}
                  </TableCell>
                  
                  <TableCell>
                    <ConfidenceBadge 
                      confidence={transaction.confidence}
                      source={transaction.categorySource}
                    />
                  </TableCell>
                  
                  <TableCell className={`text-right ${getAmountStyling(transaction)}`}>
                    {transaction.transactionType === 'income' ? '+' : ''}
                    {formatCurrency(Math.abs(transaction.normalizedAmount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No transactions found"
          description={
            startDate || endDate || selectedAccountId || searchTerm
              ? "No transactions found for the selected filters"
              : "Connect your accounts to start tracking transactions"
          }
          actionLabel={
            startDate || endDate || selectedAccountId || searchTerm 
              ? "Clear Filters" 
              : "Connect Account"
          }
          onAction={() => {
            if (startDate || endDate || selectedAccountId || searchTerm) {
              setStartDate(undefined);
              setEndDate(undefined);
              setSelectedAccountId(undefined);
              setSearchTerm('');
            }
          }}
        />
      )}
    </div>
  );
};