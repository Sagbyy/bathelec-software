'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import type { z } from 'zod';
import type { formSchema } from '@/lib/validations/derivationForm';
import { Star, Trash2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import ReactSignatureCanvas from 'react-signature-canvas';

type FormValues = z.infer<typeof formSchema>;

interface ClientValidationStepProps {
  form: UseFormReturn<FormValues>;
}

export function ClientValidationStep({ form }: ClientValidationStepProps) {
  const signatureRef = useRef<ReactSignatureCanvas>(null);
  const [clientPresent, setClientPresent] = useState(
    form.getValues('clientValidation.present')
  );

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'clientValidation.present') {
        setClientPresent(value.clientValidation?.present ?? false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">
        9. Validation des travaux par le client
      </div>

      <FormField
        control={form.control}
        name="clientValidation.present"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Le client est-il présent ?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'present')}
                defaultValue={field.value ? 'present' : 'absent'}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="present" />
                  </FormControl>
                  <FormLabel className="font-normal">Présent</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="absent" />
                  </FormControl>
                  <FormLabel className="font-normal">Absent</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {clientPresent ? (
        <>
          <FormField
            control={form.control}
            name="clientValidation.workValidation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Validation des travaux
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientValidation.satisfactionLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau de satisfaction du client</FormLabel>
                <FormControl>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-8 w-8 cursor-pointer ${
                          Number.parseInt(field.value || '0') >= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => field.onChange(rating.toString())}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientValidation.clientComment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaire du client</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Commentaires du client..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientValidation.signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signature du client ou du représentant</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="rounded-md border bg-white p-2">
                      <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                          className: 'w-full h-full',
                        }}
                        onEnd={() => {
                          field.onChange(
                            signatureRef.current
                              ?.getTrimmedCanvas()
                              .toDataURL('image/png')
                          );
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      className="flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Effacer la signature
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : null}

      <FormField
        control={form.control}
        name="clientValidation.technicianComment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {clientPresent
                ? 'Commentaire de notre électricien'
                : 'Commentaires de notre électricien'}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Commentaires de l'électricien..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
