import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '@/shared/api';

export default function RegisterTechnicianForm() {
  const registerTechnicianSchema = z
    .object({
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
      password: z
        .string()
        .min(8, 'Le mot de passe doit avoir au moins 8 caractères')
        .max(32, 'Le mot de passe doit avoir au maximum 32 caractères'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Les mots de passe ne correspondent pas',
    });

  const form = useForm<z.infer<typeof registerTechnicianSchema>>({
    resolver: zodResolver(registerTechnicianSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerTechnicianSchema>) => {
    try {
      const response = await apiClient.post('/auth/register', data);

      if (response.status !== 201) {
        throw new Error('Erreur lors de la création du technicien');
      }

      // Reset form
      form.reset();

      toast.success(`Technicien ${data.username} créé avec succès`);
    } catch (error) {
      toast.error('Une erreur est survenue lors de la création du technicien');

      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    required
                    placeholder="Prénom du technicien"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.firstName?.message}
                </FormMessage>
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
                    required
                    placeholder="Nom du technicien"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.lastName?.message}
                </FormMessage>
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
                className={clsx(form.formState.errors.email && 'text-red-500')}
              >
                Email
              </FormLabel>
              <FormControl>
                <Input
                  className={clsx(
                    form.formState.errors.email && 'border-red-500'
                  )}
                  required
                  placeholder="Email du technicien"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
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
                Nom d'utilisateur
              </FormLabel>
              <FormControl>
                <Input
                  className={clsx(
                    form.formState.errors.username && 'border-red-500'
                  )}
                  required
                  placeholder="Nom d'utilisateur du technicien"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.username?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={clsx(
                    form.formState.errors.password && 'text-red-500'
                  )}
                >
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <Input
                    className={clsx(
                      form.formState.errors.password && 'border-red-500'
                    )}
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={clsx(
                    form.formState.errors.confirmPassword && 'text-red-500'
                  )}
                >
                  Confirmation du mot de passe
                </FormLabel>
                <FormControl>
                  <Input
                    className={clsx(
                      form.formState.errors.confirmPassword && 'border-red-500'
                    )}
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="hover:bg w-full">
          Créer
        </Button>
      </form>
    </FormProvider>
  );
}
