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

type FormValues = z.infer<typeof formSchema>;

interface ClientValidationStepProps {
  form: UseFormReturn<FormValues>;
}

export function ClientValidationStep({ form }: ClientValidationStepProps) {
  const signatureRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [clientPresent, setClientPresent] = useState(
    form.getValues('clientValidation.present')
  );

  // Mettre à jour l'état local lorsque la valeur du formulaire change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'clientValidation.present') {
        setClientPresent(value.clientValidation?.present ?? false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    // Obtenir les coordonnées correctes pour le dessin
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      // Événement tactile
      if (e.touches[0] && e.touches[0].clientX) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }
    } else {
      // Événement de souris
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    if (typeof x === 'number' && typeof y === 'number') {
      ctx.moveTo(x, y);
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Obtenir les coordonnées correctes pour le dessin
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      // Événement tactile
      if (e.touches[0] && e.touches[0].clientX) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }
      e.preventDefault(); // Empêcher le défilement sur les appareils tactiles
    } else {
      // Événement de souris
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    if (typeof x === 'number' && typeof y === 'number') {
      ctx.moveTo(x, y);
    }
    ctx.stroke();

    setHasSignature(true);

    // Mettre à jour le champ de formulaire avec l'image de la signature
    updateSignatureField();
  };

  const endDrawing = () => {
    setIsDrawing(false);

    // Mettre à jour le champ de formulaire avec l'image de la signature
    updateSignatureField();
  };

  const updateSignatureField = () => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    form.setValue('clientValidation.signature', signatureData);
  };

  const clearSignature = () => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    form.setValue('clientValidation.signature', null);
  };

  // Initialiser le canvas
  useEffect(() => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    // Définir la taille du canvas pour qu'elle corresponde à sa taille d'affichage
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

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
                      <canvas
                        ref={signatureRef}
                        width={400}
                        height={200}
                        className="w-full touch-none rounded border border-gray-300"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      disabled={!hasSignature}
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
