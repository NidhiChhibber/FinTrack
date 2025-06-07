import type { Account, Transaction } from '../types';
import { CATEGORY_COLORS } from '../constants';

export const calculateNetWorth = (accounts: Account[]): number => {
  return accounts.reduce((total, account) => {
    if (['checking', 'savings', 'investment'].includes(account.type)) {
      return total + account.balance;
    } else if (['credit', 'loan'].includes(account.type)) {
      return total - Math.abs(account.balance);
    }
    return total;
  }, 0);
};

export const calculateMonthlyTotals = (transactions: Transaction[]) => {
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.transactionType === 'income') {
        acc.income += transaction.normalizedAmount;
      } else if (transaction.transactionType === 'expense') {
        acc.expenses += Math.abs(transaction.normalizedAmount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return {
    ...totals,
    net: totals.income - totals.expenses
  };
};

export const calculateCategoryBreakdown = (
  transactions: Transaction[]
): Array<{ category: string; amount: number; percentage: number; color: string }> => {
  const categoryTotals = transactions
    .filter(t => t.transactionType === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.normalizedAmount);
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Uncategorized']
    }))
    .sort((a, b) => b.amount - a.amount);
};