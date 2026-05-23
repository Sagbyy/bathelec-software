'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  useUserById,
  useUpdateUser,
  useDeleteUser,
} from '@/features/users/model/use-user';
import { toast } from 'sonner';
import clsx from 'clsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getApiErrorMessage } from '@/shared/lib/api-error';

const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit avoir au moins 2 caractères')
    .max(50, 'Le prénom doit avoir au maximum 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit avoir au moins 2 caractères')
    .max(50, 'Le nom doit avoir au maximum 50 caractères'),
  email: z.string().email('Adresse email invalide'),
  username: z
    .string()
    .min(2, "Le nom d'utilisateur doit avoir au moins 2 caractères")
    .max(50, "Le nom d'utilisateur doit avoir au maximum 50 caractères"),
  role: z.enum(['admin', 'technician'], {
    errorMap: () => ({ message: 'Le rôle doit être admin ou technician' }),
  }),
});
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/dialog';

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export default function UserDetailsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const userIdNumber = parseInt(userId as string);

  const { data: user, isLoading, error } = useUserById(userIdNumber);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      role: 'admin',
    },
  });

  useEffect(() => {
    if (user) {
      console.log(user.role);
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role as 'admin' | 'technician',
      });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateUserFormValues) => {
    updateUser(
      {
        userId: userIdNumber,
        data,
      },
      {
        onSuccess: () => {
          toast.success('Utilisateur mis à jour avec succès');
          router.push('/dashboard/admin/users');
        },
        onError: (error: Error) => {
          toast.error(
            getApiErrorMessage(error) ||
              "Une erreur est survenue lors de la mise à jour de l'utilisateur"
          );
        },
      }
    );
  };

  const onDelete = () => {
    deleteUser(userIdNumber, {
      onSuccess: () => {
        toast.success('Utilisateur supprimé avec succès');
        router.push('/dashboard/admin/users');
      },
      onError: (error: Error) => {
        toast.error(
          getApiErrorMessage(error) ||
            "Une erreur est survenue lors de la suppression de l'utilisateur"
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-center py-12">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Erreur:{' '}
              {error instanceof Error
                ? error.message
                : 'Une erreur est survenue'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:px-6">
        <Card>
          <CardContent className="pt-6">
            <p>Utilisateur non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l&apos;utilisateur</CardTitle>
          <CardDescription>
            Modifiez les informations de l&apos;utilisateur {user.username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel
                        className={clsx(
                          form.formState.errors.firstName && 'text-red-500'
                        )}
                      >
                        Prénom
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={clsx(
                            form.formState.errors.firstName && 'border-red-500'
                          )}
                          placeholder="Prénom"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel
                        className={clsx(
                          form.formState.errors.lastName && 'text-red-500'
                        )}
                      >
                        Nom
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={clsx(
                            form.formState.errors.lastName && 'border-red-500'
                          )}
                          placeholder="Nom"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={clsx(
                        form.formState.errors.email && 'text-red-500'
                      )}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(
                          form.formState.errors.email && 'border-red-500'
                        )}
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={clsx(
                        form.formState.errors.username && 'text-red-500'
                      )}
                    >
                      Nom d&apos;utilisateur
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(
                          form.formState.errors.username && 'border-red-500'
                        )}
                        placeholder="Nom d'utilisateur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={clsx(
                        form.formState.errors.role && 'text-red-500'
                      )}
                    >
                      Rôle
                    </FormLabel>
                    <Select
                      key={`role-${user?.id}-${field.value}`}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={clsx(
                            form.formState.errors.role && 'border-red-500'
                          )}
                        >
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="technician">Technicien</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                  >
                    <Icon icon="mdi:trash" className="h-4 w-4" />
                    Supprimer l'utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                    <DialogDescription>
                      Cette action ne peut pas être annulée. Cette action
                      supprimera définitivement le compte de l'utilisateur et
                      supprimera ses données de nos serveurs.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={isUpdating}>
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
