'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/card';
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/ui/select';
import { derivationStatusConfig } from '@/entities/derivation';
import { Derivation, DerivationStatus } from '@repo/types';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useUpdateCommentDerivation } from '@/features/derivations/model/use-update-comment-derivation';
import {
  correctionFormSchema,
  isReviewDecision,
  REVIEW_DECISIONS,
  type ReviewDecision,
} from '@/features/derivations/model/correction-form.schema';
import { Badge } from '@/shared/ui/badge';

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
      status: (isReviewDecision(derivation.status)
        ? derivation.status
        : '') as ReviewDecision,
    },
    validators: {
      onSubmit: correctionFormSchema,
    },
    onSubmit: ({ value }) => {
      updateCommentDerivationMutation.mutate(
        {
          correctionComment: value.correctionComment,
          status: value.status,
        },
        { onSuccess: () => router.push('/dashboard') }
      );
    },
  });

  const statuses = REVIEW_DECISIONS.map((status) => ({
    value: status,
    label: derivationStatusConfig[status].text,
  }));

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
                          placeholder="Obligatoire pour renvoyer le relevé en correction..."
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
                            field.handleChange(value as ReviewDecision)
                          }
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une décision" />
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
              Après votre revue de l'intervention, validez-la ou renvoyez-la au
              technicien pour correction.
            </FieldDescription>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">
                {derivationStatusConfig[DerivationStatus.COMPLETED].text}
              </Badge>
              <Badge variant="brand">
                {derivationStatusConfig[DerivationStatus.REVISING].text}
              </Badge>
            </div>
            <form.Subscribe
              selector={(state) => state.isPristine}
              children={(isPristine) => (
                <Field orientation="horizontal" className="w-full justify-end">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isPristine || updateCommentDerivationMutation.isPending
                    }
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
