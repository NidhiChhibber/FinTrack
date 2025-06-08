import React from 'react';
import { CreditCard, Landmark, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Account } from '../../types';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return Landmark;
      case 'credit':
        return CreditCard;
      case 'investment':
        return TrendingUp;
      default:
        return Landmark;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      case 'savings':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
      case 'credit':
        return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400';
      case 'investment':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
      case 'loan':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
  };

  const Icon = getAccountIcon(account.accountType);
  const colorClass = getAccountColor(account.accountType);

  return (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-sm p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">
              {account.displayName || account.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {account.institutionName} • {account.accountType} • ****{account.accountId.slice(-4)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${
            account.accountType === 'credit' && account.balance < 0 ? 'text-red-600' : ''
          }`}>
            {formatCurrency(account.balance)}
          </div>
          {account.availableBalance !== undefined && (
            <div className="text-sm text-muted-foreground">
              {formatCurrency(account.availableBalance)} available
            </div>
          )}
          {account.creditLimit && account.accountType === 'credit' && (
            <div className="text-sm text-muted-foreground">
              {formatCurrency(account.creditLimit - Math.abs(account.balance))} available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};