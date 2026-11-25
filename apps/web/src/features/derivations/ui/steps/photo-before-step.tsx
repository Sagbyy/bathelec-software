'use client';

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
import { CreateCompletedDerivation } from '@/entities/derivation';
import {
  REPORT_PHOTO_ACCEPT_ATTRIBUTE,
  useDerivationStatusStore,
} from '@/entities/derivation';
import { useReportPhotoField } from '../../model/use-report-photo-field';

interface PhotoBeforeStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function PhotoBeforeStep({ form }: PhotoBeforeStepProps) {
  const { previewUrl, selectPhoto, clearPhoto } = useReportPhotoField(
    form,
    'photoBeforeWork.photo'
  );
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold tracking-tight sm:text-xl">3. Photo avant travaux</div>

      <FormField
        control={form.control}
        name="photoBeforeWork.photo"
        render={({ field: { name, onBlur, ref } }) => (
          <FormItem>
            <FormLabel>
              Vue d'ensemble platine comptage
              <span className="ml-1 text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={previewUrl || '/placeholder.svg'}
                      alt="Aperçu de la photo"
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
                      disabled={isCompleted}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-primary/40 hover:bg-primary-soft/50 p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Cliquez ou glissez-déposez une photo
                      </p>
                      <input
                        type="file"
                        accept={REPORT_PHOTO_ACCEPT_ATTRIBUTE}
                        className="hidden"
                        id="photo-before-upload"
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        onChange={selectPhoto}
                        disabled={isCompleted}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById('photo-before-upload')
                            ?.click()
                        }
                        disabled={isCompleted}
                      >
                        Sélectionner une photo
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
    </div>
  );
}
