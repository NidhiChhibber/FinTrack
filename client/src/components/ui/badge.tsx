// client/src/components/ui/badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Specific badge for ML confidence
interface ConfidenceBadgeProps {
  confidence: number;
  source: 'plaid' | 'user' | 'ai' | 'rule';
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence, source }) => {
  const getVariant = () => {
    if (source === 'user') return 'success';
    if (source === 'ai') {
      if (confidence >= 0.8) return 'success';
      if (confidence >= 0.6) return 'warning';
      return 'destructive';
    }
    return 'info';
  };

  const getLabel = () => {
    if (source === 'user') return 'Manual';
    if (source === 'ai') return `AI ${Math.round(confidence * 100)}%`;
    if (source === 'plaid') return 'Auto';
    return source;
  };

  return (
    <Badge variant={getVariant()} className="text-xs">
      {getLabel()}
    </Badge>
  );
};

export { Badge, badgeVariants, ConfidenceBadge };