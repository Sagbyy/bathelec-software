'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { derivationStatusConfig } from '@/constants/derivations';
import { Derivation, DerivationStatus } from '@repo/types';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUpdateCommentDerivation } from '@/hooks/queries/use-update-comment-derivation';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  correctionComment: z.string().max(255, {
    message: 'Le commentaire ne peut pas dépasser 255 caractères',
  }),
  status: z.nativeEnum(DerivationStatus),
});

interface CorrectionCommentProps {
  derivation: Derivation;
}

export default function CorrectionComment({
  derivation,
}: CorrectionCommentProps) {
  const router = useRouter();
  const updateCommentDerivationMutation = useUpdateCommentDerivation(
    derivation.id
  );

  const form = useForm({
    defaultValues: {
      correctionComment: derivation.correctionComment || '',
      status: derivation.status as DerivationStatus,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      updateCommentDerivationMutation.mutate({
        correctionComment: value.correctionComment,
        status: value.status,
      });

      if (updateCommentDerivationMutation.isSuccess) {
        toast.success('Formulaire soumis avec succès !');
      }

      if (updateCommentDerivationMutation.isError) {
        toast.error('Erreur lors de la mise à jour du formulaire');
      }

      router.push('/dashboard');
    },
  });

  const statuses = Object.entries(derivationStatusConfig).map(
    ([key, value]) => ({
      value: key,
      label: value.text,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correction</CardTitle>
        <CardDescription>
          Veuillez corriger les informations du formulaire d'intervention,
          mettre a jour le statut du formulaire d'intervention et d'enregistrer
          les modifications afin de valider la correction au technicien.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <form.Field
                  name="correctionComment"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Commentaire de correction
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ajouter n'importe quel commentaire de correction..."
                          className="resize-none"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="status"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Mettre à jour le statut
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as DerivationStatus)
                          }
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </FieldSet>
            <FieldDescription>
              Selectionner un des trois status après votre revue : Selectionner
              un des trois status après votre revue de l'intervention.
            </FieldDescription>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-green-500">
                {derivationStatusConfig[DerivationStatus.COMPLETED].text}
              </Badge>
              {' - '}
              <Badge variant="secondary">
                {derivationStatusConfig[DerivationStatus.REVISING].text}
              </Badge>
              {' - '}
              <Badge variant="destructive">
                {derivationStatusConfig[DerivationStatus.INCORRECT].text}
              </Badge>
            </div>
            <form.Subscribe
              selector={(state) => state.isPristine}
              children={(isPristine) => (
                <Field orientation="horizontal" className="w-full justify-end">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPristine}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={isPristine}
                    onClick={() => form.reset()}
                  >
                    Annuler
                  </Button>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
