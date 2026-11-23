'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { changePasswordSchema } from '@/features/auth/model/change-password.schema';
import { useChangePassword } from '@/features/users/model/use-change-password';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const PASSWORD_RULES = [
  'Au moins 8 caractères',
  'Une majuscule',
  'Une minuscule',
  'Un chiffre',
  'Un caractère spécial (@$!%*?&)',
];

export default function ChangePassword() {
  const { mutate: changePassword, status, error } = useChangePassword();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ChangePasswordValues) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.password,
    });
  };

  if (status === 'success') {
    return (
      <PageContainer width="narrow">
        <Card className="flex flex-col items-center px-6 py-10 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Mot de passe changé
          </h1>
          <p className="mt-1 text-muted-foreground">
            Votre mot de passe a été mis à jour avec succès
          </p>
          <Button asChild className="mt-6 w-full sm:w-auto">
            <Link href="/dashboard">Retour au Dashboard</Link>
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<KeyRound />}
        title="Changer le mot de passe"
        description="Choisissez un nouveau mot de passe pour votre compte"
      />
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5 pt-4 sm:pt-6">
              <PasswordField
                control={form.control}
                name="currentPassword"
                label="Mot de passe actuel"
                placeholder="Entrez votre mot de passe actuel"
                autoComplete="current-password"
              />

              <div className="flex gap-3 rounded-lg border border-info/20 bg-info-soft p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-info-soft-foreground" />
                <div>
                  <p className="text-foreground">
                    Le mot de passe doit respecter les critères suivants :
                  </p>
                  <ul className="mt-2 grid gap-x-4 gap-y-1 text-muted-foreground sm:grid-cols-2">
                    {PASSWORD_RULES.map((rule) => (
                      <li key={rule} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-info" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <PasswordField
                control={form.control}
                name="password"
                label="Nouveau mot de passe"
                placeholder="Entrer un nouveau mot de passe"
                autoComplete="new-password"
              />
              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirmer le mot de passe"
                placeholder="Confirmer le nouveau mot de passe"
                autoComplete="new-password"
              />

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <p>{error.message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === 'pending'}
              >
                {status === 'pending' && <Loader2 className="animate-spin" />}
                {status === 'pending'
                  ? 'Changement du mot de passe...'
                  : 'Changer le mot de passe'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </PageContainer>
  );
}

interface PasswordFieldProps {
  control: Control<ChangePasswordValues>;
  name: keyof ChangePasswordValues;
  label: string;
  placeholder: string;
  autoComplete: string;
}

function PasswordField({
  control,
  name,
  label,
  placeholder,
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type={visible ? 'text' : 'password'}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="pr-11"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={
                visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
              }
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              {visible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
