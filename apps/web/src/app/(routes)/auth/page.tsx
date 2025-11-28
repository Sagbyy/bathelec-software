'use client';

import LoginForm from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function page() {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('token')) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <>
      <LoginForm />
    </>
  );
}
