'use client';

import Link from 'next/link';
import { ChevronDown, KeyRound, LogOut, UserRound } from 'lucide-react';
import { ROLE_LABELS } from '@repo/types';
import { useUserStore } from '@/entities/user';
import { getInitials } from '@/shared/lib/get-initials';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import useAuth from '../model/use-auth';

export function UserMenu() {
  const { user } = useUserStore();
  const { logout } = useAuth();

  if (!user) return null;

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  const nameInitials = getInitials(user.firstName, user.lastName);
  const initials =
    nameInitials === '?' ? getInitials(user.username) : nameInitials;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 pr-1.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Ouvrir le menu utilisateur"
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {ROLE_LABELS[user.role] ?? user.role}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserRound />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile/change-password">
            <KeyRound />
            Changer le mot de passe
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={logout}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
