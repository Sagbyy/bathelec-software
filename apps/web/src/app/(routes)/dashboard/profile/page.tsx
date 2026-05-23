'use client';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useUserStore } from '@/entities/user/model/use-user-store';
import { LockKeyhole, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/features/auth';

export default function ProfilePage() {
  const { user } = useUserStore();
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-none border-none shadow-none sm:rounded-xl sm:border sm:shadow">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <Image
                src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.username}`}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Profil</CardTitle>
            <CardDescription>
              Voir et gérer vos informations de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" value={user?.firstName} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" value={user?.lastName} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input id="username" value={user?.username} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Membre depuis</Label>
              <Input
                id="createdAt"
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''
                }
                readOnly
              />
            </div>
            <div className="space-y-3 pt-4">
              <Link
                href="/dashboard/profile/change-password"
                className="w-full"
              >
                <Button className="w-full space-x-2 bg-black hover:bg-gray-800">
                  <LockKeyhole className="h-4 w-4" />
                  <span>Changer le mot de passe</span>
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full space-x-2"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
