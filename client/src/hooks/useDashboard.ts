import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/api/dashboard';

export const useDashboard = (
  userId: string = 'user-id',
  dateRange?: { startDate: string; endDate: string }
) => {
  return useQuery({
    queryKey: ['dashboard', userId, dateRange],
    queryFn: () => dashboardService.getDashboardData(userId, dateRange),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v3)
    enabled: !!userId,
  });
};