import { z } from 'zod';

export const createCompletedDerivationSchema = z.object({
  clientInfo: z.object({
    name: z.string().min(2, { message: 'Le nom est requis' }),
    phone: z.string().optional(),
    folio: z.string().min(1, { message: 'Le folio est requis' }),
  }),

  generalInfo: z.object({
    dateTime: z.string().datetime('Date et heure invalides'),
    derivationBy: z.string().min(1, { message: 'Ce champ est requis' }),
    address: z.object({
      street: z.string().min(1, { message: "L'adresse est requise" }),
      postalCode: z.string().regex(/^\d{5}$/, {
        message: 'Le code postal doit contenir exactement 5 chiffres',
      }),
      city: z.string().min(1, { message: 'La ville est requise' }),
    }),
    building: z.string().min(1, { message: 'Le bâtiment est requis' }),
    cmIdentification: z
      .string()
      .min(1, { message: "L'identification CM est requise" }),
    floor: z.string().optional(),
    situation: z.string().optional(),
    comment: z.string().optional(),
  }),

  photoBeforeWork: z.object({
    photo: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
  }),

  oldMeter: z
    .object({
      type: z.string().min(1, { message: 'Le type de compteur est requis' }),
      generation: z.string().optional(),
      preserved: z.boolean(),
      linkyRefusal: z.boolean().optional(),
      serialNumber: z.string().optional(),
      key: z.string().optional(),
      dayIndex: z.string().optional(),
      nightIndex: z.string().optional(),
      indexPhoto: z
        .any()
        .refine((val) => val !== null, { message: 'La photo est requise' }),
    })
    .superRefine((data, ctx) => {
      if (data.type === 'linky' && !data.generation) {
        ctx.addIssue({
          path: ['generation'],
          message: "La génération est requise lorsque le type est 'linky'",
          code: 'custom',
        });
      }
    }),

  newDerivation: z.object({
    section: z.string().min(1, { message: 'La section est requise' }),
    cableType: z.string().min(1, { message: 'La nature du câble est requise' }),
    length: z.number().min(0, { message: 'La longueur doit être positive' }),
  }),

  newMeter: z.object({
    generation: z.string().min(1, { message: 'La génération est requise' }),
    serialNumber: z.string().min(1, { message: 'Le matricule est requis' }),
    dayIndex: z.string().min(1, { message: "L'index jour est requis" }),
    nightIndex: z.string().optional(),
    indexPhoto: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
  }),

  circuitBreaker: z.object({
    preserved: z.boolean(),
    voltage: z.enum(['mono', 'tri']),
    brand: z.string().min(1, { message: 'La marque est requise' }),
    type: z.enum(['non_differentiel', 'differentiel', 'selectif']),
    power: z.string().min(1, { message: 'La puissance est requise' }),
    commissioningDone: z.boolean(),
    sealed: z.boolean().refine((val) => val === true, {
      message: 'Le disjoncteur doit être scellé',
    }),
  }),

  photoAfterWork: z.object({
    photo: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
    secondPhoto: z.any().optional(),
    thirdPhoto: z.any().optional(),
  }),

  clientValidation: z
    .object({
      present: z.boolean(),
      workValidation: z.boolean().optional(),
      satisfactionLevel: z.string().optional(),
      clientComment: z.string().optional(),
      signature: z.any().optional(),
      technicianComment: z
        .string()
        .min(1, { message: 'Le commentaire est requis' }),
    })
    .refine(
      (data) => {
        if (data.present) {
          return (
            !!data.workValidation !== undefined &&
            !!data.satisfactionLevel &&
            !!data.signature
          );
        }
        return true;
      },
      {
        message: 'Tous les champs sont requis lorsque le client est présent',
        path: ['present'],
      }
    ),
});
