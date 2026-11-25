'use client';

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { REPORT_MAX_ADDITIONAL_PHOTOS } from '@repo/types';
import {
  REPORT_PHOTO_ACCEPT_ATTRIBUTE,
  useDerivationStatusStore,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { useStepNumber } from '../../model/use-step-number';
import { useReportPhotoField } from '../../model/use-report-photo-field';

interface PhotoAfterStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

type PhotoFieldName = 'photo' | 'secondPhoto' | 'thirdPhoto';

interface PhotoSlot {
  fieldName: PhotoFieldName;
  label: string;
  required: boolean;
}

const PHOTO_SLOTS: PhotoSlot[] = [
  {
    fieldName: 'photo',
    label: "Vue d'ensemble platine comptage",
    required: true,
  },
  {
    fieldName: 'secondPhoto',
    label: 'Photo supplémentaire 1 (optionnelle)',
    required: false,
  },
  {
    fieldName: 'thirdPhoto',
    label: 'Photo supplémentaire 2 (optionnelle)',
    required: false,
  },
].slice(0, 1 + REPORT_MAX_ADDITIONAL_PHOTOS) as PhotoSlot[];

const countFilledSlots = (form: UseFormReturn<CreateCompletedDerivation>) =>
  PHOTO_SLOTS.filter(({ fieldName }) =>
    Boolean(form.getValues(`photoAfterWork.${fieldName}`))
  ).length;

interface PhotoAfterFieldProps {
  form: UseFormReturn<CreateCompletedDerivation>;
  slot: PhotoSlot;
  disabled: boolean;
}

function PhotoAfterField({ form, slot, disabled }: PhotoAfterFieldProps) {
  const inputId = `photo-after-${slot.fieldName}`;
  const { previewUrl, selectPhoto, clearPhoto } = useReportPhotoField(
    form,
    `photoAfterWork.${slot.fieldName}`
  );

  return (
    <FormField
      control={form.control}
      name={`photoAfterWork.${slot.fieldName}`}
      render={({ field: { name, onBlur, ref } }) => (
        <FormItem>
          <FormLabel>
            {slot.label}
            {slot.required && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex flex-col items-center gap-4">
              {previewUrl ? (
                <div className="relative w-full">
                  <Image
                    src={previewUrl}
                    alt={`Aperçu ${slot.label}`}
                    width={400}
                    height={300}
                    className="h-auto w-full rounded-xl border object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={clearPhoto}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-primary/40 hover:bg-primary-soft/50 p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-xs text-muted-foreground">
                      {slot.required
                        ? 'Cliquez ou glissez-déposez une photo'
                        : 'Photo optionnelle'}
                    </p>
                    <input
                      type="file"
                      accept={REPORT_PHOTO_ACCEPT_ATTRIBUTE}
                      className="hidden"
                      id={inputId}
                      data-testid={inputId}
                      name={name}
                      onBlur={onBlur}
                      ref={ref}
                      onChange={selectPhoto}
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(inputId)?.click()}
                      disabled={disabled}
                    >
                      Sélectionner
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PhotoAfterStep({ form }: PhotoAfterStepProps) {
  const stepNumber = useStepNumber(form, 8);
  const { isNotEditable: isCompleted } = useDerivationStatusStore();
  const [numberOfPhotos, setNumberOfPhotos] = useState(() =>
    Math.max(1, countFilledSlots(form))
  );

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold tracking-tight sm:text-xl">
        {stepNumber}. Photo après travaux
      </div>

      <div className="grid grid-cols-1 gap-6">
        {PHOTO_SLOTS.slice(0, numberOfPhotos).map((slot) => (
          <PhotoAfterField
            key={slot.fieldName}
            form={form}
            slot={slot}
            disabled={isCompleted}
          />
        ))}
        {numberOfPhotos < PHOTO_SLOTS.length && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setNumberOfPhotos(numberOfPhotos + 1)}
            disabled={isCompleted}
          >
            Ajouter une photo supplémentaire
          </Button>
        )}
      </div>
    </div>
  );
}
