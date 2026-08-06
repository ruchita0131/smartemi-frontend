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

  const loginDemo = () => {
    localStorage.setItem('user_id', 'demo');
    localStorage.setItem('demo', 'true');
    setUser({ id: 'demo', isDemo: true });
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('demo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);