'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';

interface PhotoAfterStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function PhotoAfterStep({ form }: PhotoAfterStepProps) {
  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  useEffect(() => {
    setPreviewUrl(form.getValues('photoAfterWork.photo'));
  }, [form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        form.setValue('photoAfterWork.photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (onChange: (value: null) => void) => {
    onChange(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">
        {oldMeterPreserved ? 7 : 8}. Photo après travaux
      </div>

      <FormField
        control={form.control}
        name="photoAfterWork.photo"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Vue d'ensemble platine comptage</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={previewUrl || '/placeholder.svg'}
                      alt="Aperçu de la photo"
                      width={400}
                      height={300}
                      className="h-auto w-full rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => clearFile(onChange)}
                      disabled={isCompleted}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="mb-2 h-10 w-10 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-600">
                        Cliquez ou glissez-déposez une photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="photo-after-upload"
                        onChange={(e) => handleFileChange(e, onChange)}
                        {...field}
                        disabled={isCompleted}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById('photo-after-upload')?.click()
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
