'use client';

import Link from 'next/link';
import { ChevronRight, KeyRound, LogOut } from 'lucide-react';
import { ROLE_LABELS } from '@repo/types';
import { useUserStore } from '@/entities/user/model/use-user-store';
import { useAuth } from '@/features/auth';
import { getInitials } from '@/shared/lib/get-initials';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { PageContainer } from '@/shared/ui/page-container';

const formatMemberSince = (createdAt?: string | Date) =>
  createdAt
    ? new Date(createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

export default function ProfilePage() {
  const { user } = useUserStore();
  const { logout } = useAuth();

  if (!user) return null;

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  const nameInitials = getInitials(user.firstName, user.lastName);
  const initials =
    nameInitials === '?' ? getInitials(user.username) : nameInitials;

  const details = [
    { label: 'Prénom', value: user.firstName },
    { label: 'Nom', value: user.lastName },
    { label: 'Email', value: user.email },
    { label: "Nom d'utilisateur", value: user.username },
    { label: 'Membre depuis', value: formatMemberSince(user.createdAt) },
  ];

  return (
    <PageContainer width="narrow" className="space-y-4">
      <Card className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary-soft text-2xl font-semibold text-primary-soft-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
          <p className="mt-0.5 text-muted-foreground">{fullName}</p>
        </div>
        <Badge variant="brand">{ROLE_LABELS[user.role] ?? user.role}</Badge>
      </Card>

      <Card>
        <h2 className="px-4 pt-4 text-sm font-semibold text-muted-foreground sm:px-6">
          Informations du compte
        </h2>
        <dl className="divide-y">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="break-all text-sm font-medium sm:text-right">
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="overflow-hidden">
        <Link
          href="/dashboard/profile/change-password"
          className="flex min-h-14 items-center gap-3 px-4 transition-colors hover:bg-accent sm:px-6"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <KeyRound className="size-4" />
          </span>
          <span className="flex-1 text-sm font-medium">
            Changer le mot de passe
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </Card>

      <Button
        variant="outline"
        size="lg"
        className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive"
        onClick={() => logout()}
      >
        <LogOut />
        Se déconnecter
      </Button>
    </PageContainer>
  );
}
