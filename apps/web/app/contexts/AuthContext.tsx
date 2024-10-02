'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = Cookies.get('token');
    if (savedToken) {
      setToken(savedToken);
      // fetchUser(savedToken);
    }
  }, []);

  // const fetchUser = async (token: string) => {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   if (res.ok) {
  //     const data: User = await res.json();
  //     setUser(data);
  //   } else {
  //     setUser(null);
  //     setToken(null);
  //   }
  // };

  const login = async (credentials: LoginCredentials) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    console.log(data);
    if (data.access_token) {
      setToken(data.access_token);
      Cookies.set('token', data.access_token);
      // await fetchUser(data.access_token);
      setUser(data.access_token);
      router.push('/protected');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
