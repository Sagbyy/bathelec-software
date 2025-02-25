'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/hooks/useUserStore';
import { LockKeyhole, User2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  // const user = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'john.doe@example.com',
  //   username: 'johndoe',
  //   createdAt: new Date('2024-01-01'),
  // };

  const { user } = useUserStore();

  return (
    <div className="py-12 sm:bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-none border-none shadow-none sm:rounded-xl sm:shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <User2 className="text-primary h-10 w-10" />
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
            <div className="pt-4">
              <Link href="/change-password" className="w-full">
                <Button className="w-full space-x-2">
                  <LockKeyhole className="h-4 w-4" />
                  <span>Changer le mot de passe</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
