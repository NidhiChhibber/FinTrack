// client/src/components/transactions/AccountFilter.tsx
import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import type { AccountDTO } from '../../types';

interface AccountFilterProps {
  accounts: AccountDTO[];
  selectedAccountId?: string;
  onAccountChange: (accountId?: string) => void;
}

export const AccountFilter: React.FC<AccountFilterProps> = ({
  accounts,
  selectedAccountId,
  onAccountChange
}) => {
  const selectedAccount = accounts.find(acc => acc.id.toString() === selectedAccountId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          <CreditCard className="w-4 h-4 mr-2" />
          {selectedAccount ? selectedAccount.name : 'All Accounts'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => onAccountChange(undefined)}
          className="flex items-center justify-between"
        >
          <span>All Accounts</span>
          {!selectedAccountId && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => onAccountChange(account.id.toString())}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">{account.name}</span>
              <span className="text-xs text-muted-foreground">
                {account.accountType} • ****{account.accountId?.slice(-4)}
              </span>
            </div>
            {selectedAccountId === account.id.toString() && (
              <Check className="w-4 h-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};