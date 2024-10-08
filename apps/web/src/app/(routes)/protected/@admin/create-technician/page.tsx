'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

export default function CreateTechnician() {
  const { toast } = useToast();

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error('Erreur lors de la création du technicien');
      }

      // Reset form
      form.reset();

      toast({
        title: `Technicien ${data.username} créé`,
        description: 'Le technicien a été créé avec succès',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erreur lors de la création du technicien',
        description:
          'Une erreur est survenue lors de la création du technicien',
        variant: 'success',
      });

      console.error(error);
    }
  };

  return (
    <div className="bg-white p-5 my-4 mx-auto rounded-2xl shadow-sm w-1/2">
      <h2 className="font-semibold text-xl mb-4">Créer un technicien</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-center w-full gap-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
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
                        placeholder="Prénom du technicien"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
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
                        placeholder="Nom du technicien"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
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
                    placeholder="Email du technicien"
                    {...field}
                  />
                </FormControl>
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
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
                    placeholder="Mot de passe du technicien"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
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
                    placeholder="Confirmer le mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-[#037BCA] hover:bg">
            Créer
          </Button>
        </form>
      </Form>
    </div>
  );
}
