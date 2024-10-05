'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  sub: number;
  username: string;
  role: string; // Défini le rôle de l'utilisateur ici
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      // Décode le token pour obtenir les informations de l'utilisateur
      const decodedToken = jwtDecode(token) as User;
      console.log('Decoded token : ' + JSON.stringify(decodedToken));

      setUser(decodedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post<{ accessToken: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { username, password }
      ); // Remplace par ton endpoint
      const { accessToken } = response.data;

      Cookies.set('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);
      console.log(accessToken);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
