import { z } from 'zod';

// Schéma de validation pour le formulaire complet
export const formSchema = z.object({
  // Étape 1: Informations client
  clientInfo: z.object({
    name: z.string().min(2, { message: 'Le nom est requis' }),
    phone: z.string().min(8, { message: 'Numéro de téléphone invalide' }),
    folio: z.string().min(1, { message: 'Le folio est requis' }),
  }),

  // Étape 2: Informations générales
  generalInfo: z.object({
    dateTime: z.date(),
    derivationBy: z.string().min(1, { message: 'Ce champ est requis' }),
    address: z.object({
      street: z.string().min(1, { message: "L'adresse est requise" }),
      postalCode: z.string().min(5, { message: 'Code postal invalide' }),
      city: z.string().min(1, { message: 'La ville est requise' }),
    }),
    building: z.string().min(1, { message: 'Le bâtiment est requis' }),
    cmIdentification: z
      .string()
      .min(1, { message: "L'identification CM est requise" }),
    floor: z.string().min(1, { message: "L'étage est requis" }),
    situation: z.string().min(1, { message: 'La situation est requise' }),
    comment: z.string().optional(),
  }),

  // Étape 3: Photo avant travaux
  photoBeforeWork: z.object({
    photo: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
  }),

  // Étape 4: Ancien compteur
  oldMeter: z.object({
    type: z.string().min(1, { message: 'Le type de compteur est requis' }),
    generation: z.string().min(1, { message: 'La génération est requise' }),
    preserved: z.boolean(),
    serialNumber: z.string().min(1, { message: 'Le matricule est requis' }),
    key: z.string().min(1, { message: 'La clé est requise' }),
    dayIndex: z.string().min(1, { message: "L'index jour est requis" }),
    nightIndex: z.string().optional(),
    indexPhoto: z.any().optional(),
  }),

  // Étape 5: La nouvelle dérivation
  newDerivation: z.object({
    section: z.string().min(1, { message: 'La section est requise' }),
    cableType: z.string().min(1, { message: 'La nature du câble est requise' }),
    length: z.number().min(0, { message: 'La longueur doit être positive' }),
  }),

  // Étape 6: Nouveau compteur
  newMeter: z.object({
    generation: z.string().min(1, { message: 'La génération est requise' }),
    serialNumber: z.string().min(1, { message: 'Le matricule est requis' }),
    dayIndex: z.string().min(1, { message: "L'index jour est requis" }),
    nightIndex: z.string().optional(),
    indexPhoto: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
  }),

  // Étape 7: Disjoncteur
  circuitBreaker: z.object({
    preserved: z.boolean(),
    voltage: z.enum(['mono', 'tri']),
    brand: z.string().min(1, { message: 'La marque est requise' }),
    type: z.enum(['non_differentiel', 'differentiel', 'selectif']),
    power: z.string().min(1, { message: 'La puissance est requise' }),
    commissioningDone: z.boolean(),
    sealed: z.boolean(),
  }),

  // Étape 8: Photo après travaux
  photoAfterWork: z.object({
    photo: z
      .any()
      .refine((val) => val !== null, { message: 'La photo est requise' }),
  }),

  // Étape 9: Validation des travaux par le client
  clientValidation: z
    .object({
      present: z.boolean(),
      // Champs conditionnels basés sur la présence du client
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
        // Si le client est présent, les champs supplémentaires sont requis
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
