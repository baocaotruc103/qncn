import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContextBase';
import { supabase } from '../services/supabase';

const STORAGE_KEY = 'qncn_current_user';

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const login = useCallback(async ({ username, password }) => {
    const normalizedUsername = username.trim();

    const { data, error } = await supabase.rpc('login_user', {
      p_username: normalizedUsername,
      p_password: password,
    });

    if (error) {
      throw new Error(error.message || 'Không thể đăng nhập.');
    }

    if (!data || data.length === 0) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    const user = data[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
    }),
    [currentUser, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
