'use client';

import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
  // password: z
  //   .string()
  //   .min(8, {
  //     message: 'Le mot de passe doit contenir au moins 8 caractères.',
  //   })
  //   .max(32, {
  //     message: 'Le mot de passe ne doit pas dépasser 32 caractères.',
  //   })
  //   .regex(/[a-z]/, {
  //     message: 'Le mot de passe doit contenir au moins une lettre minuscule.',
  //   })
  //   .regex(/[A-Z]/, {
  //     message: 'Le mot de passe doit contenir au moins une lettre majuscule.',
  //   })
  //   .regex(/[0-9]/, {
  //     message: 'Le mot de passe doit contenir au moins un chiffre.',
  //   })
  //   .regex(/[@$!%*?&]/, {
  //     message:
  //       'Le mot de passe doit contenir au moins un caractère spécial (ex: @$!%*?&).',
  //   }),
});

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.username, values.password)
      router.push('/technicians')
    }
    catch(error) {
      console.log("Here error: ", error);
      
    }
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom d'utilisateur" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
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
      </form> */}
    </div>
  );
}
