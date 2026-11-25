'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { SelectItem } from '@/shared/ui/select';
import { LabeledInput } from '@/shared/ui/labeled-input';
import { LabeledSelect } from '@/shared/ui/labeled-select';
import { Button } from '@/shared/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { CreateCompletedDerivation } from '@/entities/derivation';
import {
  REPORT_PHOTO_ACCEPT_ATTRIBUTE,
  useDerivationStatusStore,
} from '@/entities/derivation';
import { useReportPhotoField } from '../../model/use-report-photo-field';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface NewMeterStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function NewMeterStep({ form }: NewMeterStepProps) {
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  const { previewUrl, selectPhoto, clearPhoto } = useReportPhotoField(
    form,
    'newMeter.indexPhoto'
  );

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold tracking-tight sm:text-xl">6. Nouveau compteur</div>

      <LabeledSelect
        control={form.control}
        name="newMeter.generation"
        label="Génération"
        placeholder="Sélectionner une génération"
        disabled={isCompleted}
        required
      >
        <SelectItem value="g1">G1</SelectItem>
        <SelectItem value="g2">G2</SelectItem>
        <SelectItem value="g3">G3</SelectItem>
      </LabeledSelect>

      <FormField
        control={form.control}
        name="newMeter.serialNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Matricule<span className="ml-1 text-destructive">*</span>
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
                placeholder="Le matricule (12 chiffres)"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LabeledInput
        control={form.control}
        name="newMeter.key"
        label="Clé"
        placeholder="La clé (2 chiffres)"
        disabled={isCompleted}
        required
      />

      <LabeledInput
        control={form.control}
        name="newMeter.dayIndex"
        label="Index jour - HP"
        placeholder="Index à relever pour tous type de contrat"
        disabled={isCompleted}
        required
      />

      <LabeledInput
        control={form.control}
        name="newMeter.nightIndex"
        label="Index nuit - HC"
        placeholder="Si le client a souscrit un contrat double tarif"
        disabled={isCompleted}
      />

      <FormField
        control={form.control}
        name="newMeter.indexPhoto"
        render={({ field: { name, onBlur, ref } }) => (
          <FormItem>
            <FormLabel>
              Photo avec index visible
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
                        id="new-meter-photo-upload"
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
