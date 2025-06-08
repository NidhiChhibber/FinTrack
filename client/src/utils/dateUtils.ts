// client/src/utils/dateUtils.ts
import { DATE_RANGES } from '../constants';

export const getDateRange = (range: keyof typeof DATE_RANGES) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'LAST_7_DAYS':
      return {
        startDate: new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      };
    
    case 'LAST_30_DAYS':
      return {
        startDate: new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      };

    case 'LAST_90_DAYS':
      return {
        startDate: new Date(startOfToday.getTime() - 90 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      };

    case 'THIS_MONTH':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString().split('T')[0],
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString().split('T')[0]
      };

    case 'LAST_MONTH':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1)
          .toISOString().split('T')[0],
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
          .toISOString().split('T')[0]
      };

    case 'THIS_YEAR':
      return {
        startDate: new Date(now.getFullYear(), 0, 1)
          .toISOString().split('T')[0],
        endDate: new Date(now.getFullYear(), 11, 31)
          .toISOString().split('T')[0]
      };

    default:
      return {
        startDate: new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      };
  }
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const targetDate = new Date(date);
  
  return today.getDate() === targetDate.getDate() &&
         today.getMonth() === targetDate.getMonth() &&
         today.getFullYear() === targetDate.getFullYear();
};

export const isThisWeek = (date: string | Date): boolean => {
  const now = new Date();
  const targetDate = new Date(date);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return targetDate >= weekAgo && targetDate <= now;
};