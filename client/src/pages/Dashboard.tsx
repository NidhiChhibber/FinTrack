// client/src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  PiggyBank,
  Target,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { useAccounts, useAccountSummary, useSyncTransactions } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrentUser } from '../hooks/useCurrentUser'; // Import our new hook
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  formatCurrency, 
  formatDate, 
  formatRelativeTime, 
  calculateMonthlyTotals, 
  calculateCategoryBreakdown, 
  calculateTrendData 
} from '../utils/calculations';
// Import only the types that exist in the types file
import type { Account } from '../types';

// Type definitions
interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  subtitle?: string;
}

interface CategoryChartProps {
  categories: CategoryData[];
}

interface SpendingTrendChartProps {
  data: TrendData[];
}

interface AccountBalanceCardProps {
  account: Account;
}

// Chart Component for Category Spending
const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;
  
  const maxAmount = Math.max(...categories.map(c => c.amount));
  
  return (
    <div className="space-y-4">
      {categories.slice(0, 6).map((category) => (
        <div key={category.category} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {category.category}
            </span>
            <div className="text-right">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(category.amount)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {category.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${(category.amount / maxAmount) * 100}%`,
                backgroundColor: category.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Updated Spending Trend Chart - Bar Chart Version with Hover Tooltip
const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState<{ index: number; x: number; y: number; data: TrendData } | null>(null);
  
  if (!data || data.length === 0) return null;
  
  // Check if we have any actual data (income OR expenses)
  const hasData = data.some(d => d.income > 0 || d.expenses > 0);
  
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }
  
  const maxTotal = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
  const chartHeight = 200;
  const barWidth = 40;
  const spacing = 20;
  const chartWidth = data.length * (barWidth + spacing);
  
  return (
    <div className="relative overflow-x-auto">
      <div className="relative" style={{ height: chartHeight + 60, minWidth: chartWidth }}>
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line 
                x1="0" 
                y1={chartHeight * ratio} 
                x2="100%" 
                y2={chartHeight * ratio}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.5"
              />
            </g>
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <text
              key={index}
              x="-10"
              y={chartHeight * ratio + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              ${((maxTotal * (1 - ratio)) / 1000).toFixed(1)}K
            </text>
          ))}
          
          {/* Bars */}
          {data.map((point: TrendData, index: number) => {
            const x = index * (barWidth + spacing) + spacing;
            const income = point.income || 0;
            const expenses = point.expenses || 0;
            
            const incomeHeight = (income / maxTotal) * chartHeight;
            const expenseHeight = (expenses / maxTotal) * chartHeight;
            
            // Ensure all values are valid numbers
            const validIncomeHeight = isNaN(incomeHeight) ? 0 : incomeHeight;
            const validExpenseHeight = isNaN(expenseHeight) ? 0 : expenseHeight;
            
            const maxBarHeight = Math.max(validIncomeHeight, validExpenseHeight);
            const isHovered = hoveredBar?.index === index;
            
            return (
              <g key={index}>
                {/* Income bar (left side or full width if no expenses) */}
                {income > 0 && (
                  <rect
                    x={x + (expenses > 0 ? 0 : 0)}
                    y={chartHeight - validIncomeHeight}
                    width={expenses > 0 ? barWidth / 2 : barWidth}
                    height={validIncomeHeight}
                    fill="#059669"
                    rx="2"
                    className={`transition-all duration-200 cursor-pointer ${isHovered ? 'opacity-80' : 'hover:opacity-90'}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const containerRect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                      const relativeX = rect.left - (containerRect?.left || 0) + rect.width / 2;
                      setHoveredBar({
                        index,
                        x: relativeX,
                        y: 60, // Fixed distance from top of chart
                        data: point
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                )}
                
                {/* Expense bar (right side or full width if no income) */}
                {expenses > 0 && (
                  <rect
                    x={x + (income > 0 ? barWidth / 2 : 0)}
                    y={chartHeight - validExpenseHeight}
                    width={income > 0 ? barWidth / 2 : barWidth}
                    height={validExpenseHeight}
                    fill="#84cc16"
                    rx="2"
                    className={`transition-all duration-200 cursor-pointer ${isHovered ? 'opacity-80' : 'hover:opacity-90'}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const containerRect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                      const relativeX = rect.left - (containerRect?.left || 0) + rect.width / 2;
                      setHoveredBar({
                        index,
                        x: relativeX,
                        y: 60, // Fixed distance from top of chart
                        data: point
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                )}
                
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {point.month}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Hover tooltip */}
        {hoveredBar && (
          <div 
            className="absolute bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-xl border border-gray-700 pointer-events-none z-50"
            style={{
              left: Math.max(10, Math.min(hoveredBar.x - 80, chartWidth - 170)),
              top: Math.max(10, hoveredBar.y - 100),
              minWidth: '160px'
            }}
          >
            <div className="font-semibold text-center mb-2">{hoveredBar.data.month}</div>
            
            {hoveredBar.data.income > 0 && (
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                <span className="text-emerald-400">Income</span>
                <span className="ml-auto font-bold">${hoveredBar.data.income.toLocaleString()}</span>
              </div>
            )}
            
            {hoveredBar.data.expenses > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                <span className="text-lime-400">Expenses</span>
                <span className="ml-auto font-bold">${hoveredBar.data.expenses.toLocaleString()}</span>
              </div>
            )}
            
            {/* Small arrow pointing down to the bar */}
            <div 
              className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-4px'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-emerald-600 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-lime-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
      </div>
    </div>
  );
};

// Modern Metric Card
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, trend, subtitle }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500">{subtitle}</div>
          )}
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
            isPositive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <TrendIcon className="w-3 h-3" />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Account Balance Card
const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm">{account.name}</p>
            <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            account.accountType === 'checking' ? 'bg-blue-500/30' :
            account.accountType === 'savings' ? 'bg-green-500/30' :
            account.accountType === 'credit' ? 'bg-red-500/30' :
            'bg-purple-500/30'
          }`}>
            {account.accountType}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-100 text-sm">
            ****{account.accountId?.slice(-4)}
          </span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white opacity-5 rounded-full"></div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { userId, user } = useCurrentUser(); // Use our new hook to get the real userId
  
  // Get current month date range for transactions
  const currentMonth = {
    startDate: new Date(new Date().getFullYear()-1, new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  };
  
  // Fetch real data from backend using the actual userId
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(userId);
  const { data: accountSummary, isLoading: summaryLoading, error: summaryError } = useAccountSummary(userId);
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(
    { ...currentMonth, limit: 1000 }, 
    userId
  );
  
  // Sync mutation for manual refresh
  const syncMutation = useSyncTransactions();
  
  const isLoading = accountsLoading || summaryLoading || transactionsLoading;
  const hasError = accountsError || summaryError || transactionsError;
  
  // Process transaction data
  const processedTransactions = transactions || [];
  const monthlyTotals = calculateMonthlyTotals(processedTransactions);
  const categoryBreakdown = calculateCategoryBreakdown(processedTransactions);

  
  // Get recent transactions (last 5)
  const recentTransactions = processedTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate real trend data from transactions (last 3 months)
  const trendData = calculateTrendData(processedTransactions);
  
  // Handle sync transactions
  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync(userId);
    } catch (error) {
      console.error('Failed to sync transactions:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading your financial overview..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
          <p className="text-sm text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(new Date())}
          </p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          <span>{syncMutation.isPending ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Income"
          value={formatCurrency(monthlyTotals.income)}
          change="+12.5%"
          trend="up"
          icon={TrendingUp}
          subtitle="This month"
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(monthlyTotals.expenses)}
          change="+8.2%"
          trend="up"
          icon={TrendingDown}
          subtitle="This month"
        />
        <MetricCard
          title="Net Income"
          value={formatCurrency(monthlyTotals.net)}
          change="+15.3%"
          trend={monthlyTotals.net > 0 ? "up" : "down"}
          icon={DollarSign}
          subtitle="Income - Expenses"
        />
        <MetricCard
          title="Net Worth"
          value={formatCurrency(accountSummary?.netWorth || 0)}
          change="+6.7%"
          trend="up"
          icon={Target}
          subtitle="Total assets"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Spending by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Spending Breakdown
              </h2>
              <span className="text-sm text-gray-500">This month</span>
            </div>
            <CategoryChart categories={categoryBreakdown} />
          </div>

          {/* Income vs Expenses Trend - Now Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Money Flow
              </h2>
              <span className="text-sm text-gray-500">Last 3 months</span>
            </div>
            <SpendingTrendChart data={trendData} />
          </div>
        </div>

        {/* Right Column - Account Cards & Recent Activity */}
        <div className="space-y-8">
          {/* Account Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Accounts
            </h2>
            <div className="space-y-4">
              {accounts?.slice(0, 3).map((account) => (
                <AccountBalanceCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.normalizedAmount > 0 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.category?.[0] || 'T'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(transaction.date)}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.normalizedAmount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {transaction.normalizedAmount > 0 ? '+' : ''}
                    {formatCurrency(transaction.normalizedAmount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">Smart Insight</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};