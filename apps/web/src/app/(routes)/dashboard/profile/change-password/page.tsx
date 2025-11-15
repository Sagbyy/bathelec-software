'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import Link from 'next/link';
import { changePasswordSchema } from '@/validators/change-password.schema';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Separator } from '@/components/ui/separator';
import { useChangePassword } from '@/hooks/queries/useChangePassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  });

  const { mutate: changePassword, status, error } = useChangePassword();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.password,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (status === 'success') {
    return (
      <div className="absolute left-1/2 top-1/2 mx-4 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center space-x-2">
              <Icon
                icon="mdi:check-circle"
                className="h-6 w-6 text-green-500"
              />
              <CardTitle>Mot de passe changé</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Votre mot de passe a été mis à jour avec succès
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard">Retour au Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-4 flex min-h-[50vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={
                            showPassword.currentPassword ? 'text' : 'password'
                          }
                          placeholder="Enter your current password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            togglePasswordVisibility('currentPassword')
                          }
                        >
                          {showPassword.currentPassword ? (
                            <Icon icon="mdi:eye-off" className="h-4 w-4" />
                          ) : (
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword.currentPassword
                              ? 'Hide password'
                              : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <Alert className="bg-muted">
                <Icon className="h-4 w-4" icon="mdi:information" />
                <AlertDescription>
                  Le mot de passe doit respecter les critères suivants :
                  <ul className="ml-2 mt-2 list-inside list-disc text-sm">
                    <li>Au moins 8 caractères</li>
                    <li>Une majuscule</li>
                    <li>Une minuscule</li>
                    <li>Un chiffre</li>
                    <li>Un caractère spécial (@$!%*?&)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword.password ? 'text' : 'password'}
                          placeholder="Entrer un nouveau mot de passe"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('password')}
                        >
                          {showPassword.password ? (
                            <Icon icon="mdi:eye-off" className="h-4 w-4" />
                          ) : (
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword.password
                              ? 'Hide password'
                              : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={
                            showPassword.confirmPassword ? 'text' : 'password'
                          }
                          placeholder="Confirmer le nouveau mot de passe"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            togglePasswordVisibility('confirmPassword')
                          }
                        >
                          {showPassword.confirmPassword ? (
                            <Icon icon="mdi:eye-off" className="h-4 w-4" />
                          ) : (
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword.confirmPassword
                              ? 'Hide password'
                              : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <div className="flex flex-row items-center gap-2">
                    <Icon className="h-4 w-4" icon="mdi:alert-circle" />
                    <AlertDescription>{error.message}</AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending'
                  ? 'Changement du mot de passe...'
                  : 'Changer le mot de passe'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
