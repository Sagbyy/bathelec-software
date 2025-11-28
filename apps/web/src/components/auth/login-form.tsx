'use client';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import useAuth from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loader from '@/components/shared/loader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});

export default function LoginForm() {
  const { login, loading, error } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    login(values.username, values.password);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-3 w-full max-w-72 rounded-lg bg-white p-4 shadow-sm">
        <Image
          src="/logo-abrisur.webp"
          className="mx-auto h-auto w-auto"
          alt="Abrisûr Logo"
          width={200}
          height={100}
          priority
        />
        {error && (
          <Alert variant="destructive" className="my-3">
            <Icon className="h-4 w-4" icon="octicon:alert-24" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Votre nom d'utilisateur ou mot de passe est incorrect.
            </AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="m-5 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={clsx(error && 'text-red-500')}>
                      Nom d'utilisateur
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(error && 'border-red-500')}
                        required
                        placeholder="Votre nom d'utilisateur"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={clsx(error && 'text-red-500')}>
                      Mot de passe
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(error && 'border-red-500')}
                        required
                        placeholder="Votre mot de passe"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="hover:bg w-full bg-[#CD2C35]">
                Se connecter
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
