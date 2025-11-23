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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface NewMeterStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function NewMeterStep({ form }: NewMeterStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  useEffect(() => {
    setPreviewUrl(form.getValues('newMeter.indexPhoto'));
  }, [form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: File) => void
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      onChange(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        form.setValue('newMeter.indexPhoto', reader.result);
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
      <div className="text-xl font-semibold">6. Nouveau compteur</div>

      <FormField
        control={form.control}
        name="newMeter.generation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Génération<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une génération" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="g1">G1</SelectItem>
                <SelectItem value="g2">G2</SelectItem>
                <SelectItem value="g3">G3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newMeter.serialNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Matricule<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Zoom>
              <Image
                src={'/images/linky-help-matricule.png'}
                alt="Aperçu de la photo"
                width={200}
                height={100}
                className="rounded-md"
              />
            </Zoom>
            <FormControl>
              <Input
                placeholder="Ex: 12 chiffres"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newMeter.dayIndex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Index jour - HP<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Index à relever pour tous type de contrat"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newMeter.nightIndex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Index nuit - HC</FormLabel>
            <FormControl>
              <Input
                placeholder="Si le client a souscrit un contrat double tarif"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newMeter.indexPhoto"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              Photo avec index visible
              <span className="ml-1 text-red-500">*</span>
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
                        id="new-meter-photo-upload"
                        onChange={(e) => handleFileChange(e, onChange)}
                        {...field}
                        disabled={isCompleted}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById('new-meter-photo-upload')
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
