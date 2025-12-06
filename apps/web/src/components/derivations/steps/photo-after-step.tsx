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

interface PhotoPreview {
  url: string | null;
  fieldName: 'photo' | 'secondPhoto' | 'thirdPhoto';
  label: string;
  required: boolean;
}

export function PhotoAfterStep({ form }: PhotoAfterStepProps) {
  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  const photos: PhotoPreview[] = [
    {
      fieldName: 'photo',
      label: "Vue d'ensemble platine comptage",
      required: true,
      url: null,
    },
    {
      fieldName: 'secondPhoto',
      label: 'Photo supplémentaire 1 (optionnelle)',
      required: false,
      url: null,
    },
    {
      fieldName: 'thirdPhoto',
      label: 'Photo supplémentaire 2 (optionnelle)',
      required: false,
      url: null,
    },
  ];

  const [previewUrls, setPreviewUrls] = useState<Record<string, string | null>>(
    {}
  );

  useEffect(() => {
    const initialUrls: Record<string, string | null> = {};
    const photoFields: Array<'photo' | 'secondPhoto' | 'thirdPhoto'> = [
      'photo',
      'secondPhoto',
      'thirdPhoto',
    ];
    photoFields.forEach((fieldName) => {
      const value = form.getValues(`photoAfterWork.${fieldName}`);
      initialUrls[fieldName] = value || null;
    });
    setPreviewUrls(initialUrls);
  }, [form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'photo' | 'secondPhoto' | 'thirdPhoto',
    onChange: (value: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrls((prev) => ({ ...prev, [fieldName]: result }));
        form.setValue(`photoAfterWork.${fieldName}`, result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (
    fieldName: 'photo' | 'secondPhoto' | 'thirdPhoto',
    onChange: (value: null) => void
  ) => {
    onChange(null);
    setPreviewUrls((prev) => ({ ...prev, [fieldName]: null }));
    form.setValue(`photoAfterWork.${fieldName}`, null);
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">
        {oldMeterPreserved ? 7 : 8}. Photo après travaux
      </div>

      <div className="grid grid-cols-1 gap-6">
        {photos.map((photo) => (
          <FormField
            key={photo.fieldName}
            control={form.control}
            name={`photoAfterWork.${photo.fieldName}`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>
                  {photo.label}
                  {photo.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-4">
                    {previewUrls[photo.fieldName] ? (
                      <div className="relative w-full">
                        <Image
                          src={
                            previewUrls[photo.fieldName] || '/placeholder.svg'
                          }
                          alt={`Aperçu ${photo.label}`}
                          width={400}
                          height={300}
                          className="h-auto w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => clearFile(photo.fieldName, onChange)}
                          disabled={isCompleted}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full rounded-md border-2 border-dashed border-gray-300 p-6 text-center">
                        <div className="flex flex-col items-center">
                          <Upload className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="mb-2 text-xs text-gray-600">
                            {photo.required
                              ? 'Cliquez ou glissez-déposez une photo'
                              : 'Photo optionnelle'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`photo-after-${photo.fieldName}`}
                            onChange={(e) =>
                              handleFileChange(e, photo.fieldName, onChange)
                            }
                            {...field}
                            disabled={isCompleted}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(
                                  `photo-after-${photo.fieldName}`
                                )
                                ?.click()
                            }
                            disabled={isCompleted}
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
        ))}
      </div>
    </div>
  );
}
