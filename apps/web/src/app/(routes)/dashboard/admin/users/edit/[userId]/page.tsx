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
import { AlertTriangle, UserPen, UserX } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import clsx from 'clsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { useUserStore } from '@/entities/user';
import { OfficialDocumentsForm } from '@/features/official-documents';
import { Role, ROLE_VALUES, ROLE_LABELS } from '@repo/types';

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
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Rôle invalide' }),
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
  const { user: currentUser } = useUserStore();
  const canEditRole = currentUser?.role === Role.ADMIN;
  const canManageDocuments =
    currentUser?.role === Role.ADMIN ||
    (currentUser?.role === Role.SUPERVISOR && user?.role !== Role.ADMIN);

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      role: Role.ADMIN,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
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
      <PageContainer width="narrow">
        <Skeleton className="mb-8 h-12 w-72" />
        <Skeleton className="h-[480px] rounded-xl" />
        <span className="sr-only">Chargement...</span>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={<AlertTriangle />}
          title="Impossible de charger l'utilisateur"
          description={
            error instanceof Error ? error.message : 'Une erreur est survenue'
          }
        />
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer width="narrow">
        <EmptyState icon={<UserX />} title="Utilisateur non trouvé" />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<UserPen />}
        title="Modifier l'utilisateur"
        description={`Modifiez les informations de l'utilisateur ${user.username}`}
      />
      <Card>
        <CardContent className="pt-4 sm:pt-6">
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
                          form.formState.errors.firstName && 'text-destructive'
                        )}
                      >
                        Prénom
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={clsx(
                            form.formState.errors.firstName &&
                              'border-destructive'
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
                          form.formState.errors.lastName && 'text-destructive'
                        )}
                      >
                        Nom
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={clsx(
                            form.formState.errors.lastName &&
                              'border-destructive'
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
                        form.formState.errors.email && 'text-destructive'
                      )}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(
                          form.formState.errors.email && 'border-destructive'
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
                        form.formState.errors.username && 'text-destructive'
                      )}
                    >
                      Nom d&apos;utilisateur
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={clsx(
                          form.formState.errors.username && 'border-destructive'
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
                        form.formState.errors.role && 'text-destructive'
                      )}
                    >
                      Rôle
                    </FormLabel>
                    <Select
                      key={`role-${user?.id}-${field.value}`}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!canEditRole}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={clsx(
                            form.formState.errors.role && 'border-destructive'
                          )}
                        >
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_VALUES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
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
                    <DialogClose asChild>
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

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
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

      {canManageDocuments && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Documents officiels</CardTitle>
            <CardDescription>
              Consultez, remplacez ou retirez les documents officiels de{' '}
              {user.username}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OfficialDocumentsForm userId={userIdNumber} />
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
