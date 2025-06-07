export const formatCurrency = (
  amount: number, 
  options: {
    showSign?: boolean;
    currency?: string;
    minimumFractionDigits?: number;
  } = {}
): string => {
  const { 
    showSign = false, 
    currency = 'USD',
    minimumFractionDigits = 2 
  } = options;

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));

  if (!showSign) return formatted;
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};

// FIXED formatDate function with proper typing
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = new Date(date);
  
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { month: 'short', day: 'numeric' };
      break;
    case 'medium':
      options = { month: 'short', day: 'numeric', year: 'numeric' };
      break;
    case 'long':
      options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      break;
    default:
      options = { month: 'short', day: 'numeric', year: 'numeric' };
  }

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return formatDate(date, 'short');
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};