import { AccountType } from '../enums/index.js';

export const ACCOUNT_CONSTANTS = Object.freeze({
  VALIDATION: {
    MAX_NAME_LENGTH: 100,
    MAX_OFFICIAL_NAME_LENGTH: 200,
    MIN_BALANCE: -1000000,
    MAX_BALANCE: 1000000000
  },
  
  DISPLAY: {
    COLORS: {
      [AccountType.CHECKING]: '#3B82F6',
      [AccountType.SAVINGS]: '#10B981',
      [AccountType.CREDIT]: '#EF4444',
      [AccountType.INVESTMENT]: '#8B5CF6',
      [AccountType.LOAN]: '#F59E0B'
    },
    ICONS: {
      [AccountType.CHECKING]: 'CreditCard',
      [AccountType.SAVINGS]: 'PiggyBank',
      [AccountType.CREDIT]: 'CreditCard',
      [AccountType.INVESTMENT]: 'TrendingUp',
      [AccountType.LOAN]: 'DollarSign'
    }
  },
  
  SYNC: {
    BALANCE_UPDATE_INTERVAL_HOURS: 1,
    ACCOUNT_REFRESH_INTERVAL_HOURS: 24
  }
});