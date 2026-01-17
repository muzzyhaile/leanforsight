import { useEffect, useState } from 'react';
import { authService } from '../services/AuthService.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (newUser) => {
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    login,
    logout
  };
};
