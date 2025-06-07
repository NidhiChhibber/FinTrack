import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AccountSummaryCardProps {
  title: string;
  amount: number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  title,
  amount,
  description,
  icon: Icon,
  iconColor
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="text-2xl font-bold mt-2">
        {formatCurrency(amount)}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
};