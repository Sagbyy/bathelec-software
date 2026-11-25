'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { SelectItem } from '@/shared/ui/select';
import { LabeledInput } from '@/shared/ui/labeled-input';
import { LabeledSelect } from '@/shared/ui/labeled-select';
import { Switch } from '@/shared/ui/switch';
import { Button } from '@/shared/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import {
  REPORT_PHOTO_ACCEPT_ATTRIBUTE,
  useDerivationStatusStore,
  oldMeterRequiresKey,
} from '@/entities/derivation';
import { useReportPhotoField } from '../../model/use-report-photo-field';
interface OldMeterStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function OldMeterStep({ form }: OldMeterStepProps) {
  const oldMeterType = form.watch('oldMeter.type');
  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const oldMeterLinkyRefusal = form.watch('oldMeter.linkyRefusal');
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  const requiresKey = oldMeterRequiresKey({
    type: oldMeterType,
    preserved: oldMeterPreserved,
    linkyRefusal: oldMeterLinkyRefusal,
  });

  const { previewUrl, selectPhoto, clearPhoto } = useReportPhotoField(
    form,
    'oldMeter.indexPhoto'
  );

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold tracking-tight sm:text-xl">4. Ancien compteur</div>

      <LabeledSelect
        control={form.control}
        name="oldMeter.type"
        label="Type de compteur"
        placeholder="Sélectionner un type"
        disabled={isCompleted}
        required
      >
        <SelectItem value="electromecanique">Électromécanique</SelectItem>
        <SelectItem value="cbe">CBE</SelectItem>
        <SelectItem value="linky">Linky</SelectItem>
        <SelectItem value="other">Autre</SelectItem>
      </LabeledSelect>

      {oldMeterType === 'linky' && (
        <LabeledSelect
          control={form.control}
          name="oldMeter.generation"
          label="Génération"
          placeholder="Sélectionner une génération"
          disabled={isCompleted}
          required
        >
          <SelectItem value="g1">G1</SelectItem>
          <SelectItem value="g2">G2</SelectItem>
          <SelectItem value="g3">G3</SelectItem>
        </LabeledSelect>
      )}

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <FormField
          control={form.control}
          name="oldMeter.preserved"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Conservé</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isCompleted}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {oldMeterType !== 'linky' && (
          <FormField
            control={form.control}
            name="oldMeter.linkyRefusal"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Refus de Linky</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isCompleted}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      <LabeledInput
        control={form.control}
        name="oldMeter.serialNumber"
        label="Matricule"
        placeholder={
          requiresKey
            ? 'Le matricule (12 chiffres)'
            : 'Les 3 derniers chiffres du dernier groupe de 5 numéros'
        }
        disabled={isCompleted}
      />

      {requiresKey && (
        <LabeledInput
          control={form.control}
          name="oldMeter.key"
          label="Clé"
          placeholder="La clé (2 chiffres)"
          disabled={isCompleted}
        />
      )}

      {!oldMeterPreserved && (
        <>
          <LabeledInput
            control={form.control}
            name="oldMeter.dayIndex"
            label="Index jour - HP"
            placeholder="Index à relever pour tous type de contrat"
            disabled={isCompleted}
          />

          <LabeledInput
            control={form.control}
            name="oldMeter.nightIndex"
            label="Index nuit - HC"
            placeholder="Si le client a souscrit un contrat double tarif"
            disabled={isCompleted}
          />

          <FormField
            control={form.control}
            name="oldMeter.indexPhoto"
            render={({ field: { name, onBlur, ref } }) => (
              <FormItem>
                <FormLabel>
                  Photo relevé index ancien compteur
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
                            id="old-meter-photo-upload"
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
                                .getElementById('old-meter-photo-upload')
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
        </>
      )}
    </div>
  );
}
