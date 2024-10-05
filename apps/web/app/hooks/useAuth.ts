'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUserStore } from './useUserStore';
import { useState } from 'react';

const useAuth = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const login = async (username: string, password: string) => {
    setError(false);
    setLoading(true);
    try {
      let response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      const { accessToken } = response.data;

      Cookies.set('token', accessToken);

      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/informations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('user info', userResponse);

      setUser(userResponse.data);

      router.push('/protected');
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log('Here error: ', error);
    }
  };

  const logout = async () => {
    Cookies.remove('token');
    router.push('/auth');
  };

  return { login, logout, error, loading };
};

export default useAuth;
