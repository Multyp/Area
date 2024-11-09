// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const AuthContext = createContext<any>({});

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const { token } = parseCookies();
    if (token) {
      const decoded = jwtDecode(token);
      console.log('decoded', decoded);
      setUser(decoded);
    }
  }, []);

  const login = (token: string) => {
    setCookie(null, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    destroyCookie(null, 'token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
