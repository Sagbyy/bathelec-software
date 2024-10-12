'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User } from '@repo/types/index';
import { useUserStore } from '@/hooks/useUserStore';
import getUsernameByToken from '@/lib/decodeJwt';
import { Navbar } from '@/components/protected/Navbar';

const fetchUserData = async (): Promise<User> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/informations`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );

  return response.data;
};

export default function LayoutProtected({
  children,
  technician,
  admin,
}: {
  children: ReactNode;
  technician: ReactNode;
  admin: ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const { setUser } = useUserStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryFn: fetchUserData,
    queryKey: ['user', getUsernameByToken(Cookies.get('token'))],
    enabled: !!Cookies.get('token') && isClient,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  if (!isClient) {
    return null;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Navbar />
          <p>
            Welcome {user?.firstName} {user?.lastName}
          </p>
          {children}
          {user?.role === 'admin' ? admin : technician}
        </>
      )}
    </>
  );
}
