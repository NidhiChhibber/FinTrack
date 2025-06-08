// client/src/utils/calculations.ts
import type { TransactionDTO, MonthlyTotals, CategoryData, TrendData } from '../types';

export const calculateMonthlyTotals = (transactions: TransactionDTO[]): MonthlyTotals => {
  let income = 0;
  let expenses = 0;

  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.normalizedAmount);
    
    if (transaction.transactionType === 'income') {
      income += amount;
    } else if (transaction.transactionType === 'expense') {
      expenses += amount;
    }
  });

  return {
    income,
    expenses,
    net: income - expenses,
    transactionCount: transactions.length
  };
};

export const calculateCategoryBreakdown = (transactions: TransactionDTO[]): CategoryData[] => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const categoryMap = new Map();
  let totalExpenses = 0;

  // Only use transactions that are explicitly marked as 'expense'
  const expenseTransactions = transactions.filter(tx => tx.transactionType === 'expense');

  expenseTransactions.forEach(transaction => {
    const amount = Math.abs(transaction.normalizedAmount);
    totalExpenses += amount;
    
    const category = transaction.category || 'Uncategorized';
    const existing = categoryMap.get(category) || { amount: 0, count: 0 };
    categoryMap.set(category, {
      amount: existing.amount + amount,
      count: existing.count + 1
    });
  });

  const categories: CategoryData[] = [];
  let colorIndex = 0;
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  
  categoryMap.forEach((data, category) => {
    categories.push({
      category,
      amount: data.amount,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      transactionCount: data.count,
      color: colors[colorIndex % colors.length]
    });
    colorIndex++;
  });

  return categories.sort((a, b) => b.amount - a.amount);
};

export const calculateTrendData = (transactions: TransactionDTO[]): TrendData[] => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const monthlyData = new Map();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    // Use YYYY-MM format for more precise matching
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const existing = monthlyData.get(monthKey) || { income: 0, expenses: 0 };
    
    if (transaction.transactionType === 'income') {
      existing.income += Math.abs(transaction.normalizedAmount);
    } else if (transaction.transactionType === 'expense') {
      existing.expenses += Math.abs(transaction.normalizedAmount);
    }
    
    monthlyData.set(monthKey, existing);
  });

  // Get all months that have data, sorted by date
  const availableMonths = Array.from(monthlyData.keys()).sort();
  
  // Take the last 3 months that actually have data
  const lastThreeMonths = availableMonths.slice(-3);
  
  const months: TrendData[] = lastThreeMonths.map(monthKey => {
    const data = monthlyData.get(monthKey) || { income: 0, expenses: 0 };
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    return {
      month: monthName,
      income: data.income,
      expenses: data.expenses
    };
  });
  
  return months;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US');
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 0) return 'Today';
    if (futureDays === 1) return 'Tomorrow';
    return `In ${futureDays} days`;
  }
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  return dateObj.toLocaleDateString('en-US');
};