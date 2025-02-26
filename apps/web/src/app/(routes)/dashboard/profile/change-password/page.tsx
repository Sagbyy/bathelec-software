'use client';

import type React from 'react';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

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
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '@/lib/validations/changePassword';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Separator } from '@/components/ui/separator';

export default function ChangePassword() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validatedData = changePasswordSchema.parse(formData);

      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: validatedData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setIsSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
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
    <form
      onSubmit={handleSubmit}
      className="flex min-h-[50vh] items-center justify-center py-12"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword.currentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter your current password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    currentPassword: !prev.currentPassword,
                  }))
                }
              >
                {showPassword.currentPassword ? (
                  <Icon icon="eva:eye-off-outline" className="h-4 w-4" />
                ) : (
                  <Icon icon="eva:eye-outline" className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword.currentPassword
                    ? 'Hide password'
                    : 'Show password'}
                </span>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <Alert className="bg-muted">
            <Info className="h-4 w-4" />
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
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword.password ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Entrer un nouveau mot de passe"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
              >
                {showPassword.password ? (
                  <Icon icon="eva:eye-off-outline" className="h-4 w-4" />
                ) : (
                  <Icon icon="eva:eye-outline" className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword.password ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPassword.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirmer le nouveau mot de passe"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
              >
                {showPassword.confirmPassword ? (
                  <Icon icon="eva:eye-off-outline" className="h-4 w-4" />
                ) : (
                  <Icon icon="eva:eye-outline" className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword.confirmPassword
                    ? 'Hide password'
                    : 'Show password'}
                </span>
              </Button>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Changement du mot de passe...'
              : 'Changer le mot de passe'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
