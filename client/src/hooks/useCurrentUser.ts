// client/src/hooks/useCurrentUser.ts
import { useAuth } from '../context/AuthProvider';

export const useCurrentUser = () => {
  const { user } = useAuth();
  
  return {
    userId: user?.username || 'user-id', // Use username as userId, fallback to default
    user,
    isLoggedIn: !!user
  };
};