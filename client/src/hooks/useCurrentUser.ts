// client/src/hooks/useCurrentUser.ts
import { useAuth0 } from '@auth0/auth0-react';

export const useCurrentUser = () => {
  const { user } = useAuth0();
  
  return {
    userId: user?.sub || 'user-id',
    user,
    isLoggedIn: !!user
  };
};
