'use client';

import Image from 'next/image';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginUser } from '@repo/types/index';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginUser>();

  const onSubmit: SubmitHandler<LoginUser> = (data) => {
    login(data);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-sm rounded-lg">
      <Image
        src="/bathelec-brand-logo.png"
        className="mx-auto"
        alt="Bathelec Logo"
        width={200}
        height={100}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('username')}
          placeholder="Username"
          type="text"
          required
        />
        <input
          {...register('password')}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
