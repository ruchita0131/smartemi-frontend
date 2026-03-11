import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem('user_id');
    return id ? { id: parseInt(id) } : null;
  });

  const login = (userId, token) => {
    localStorage.setItem('user_id', userId);
    localStorage.setItem('access_token', token);
    setUser({ id: userId });
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);