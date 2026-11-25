import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import {
  isNewMeterInstalled,
  type OldMeterOutcome,
  isValidFolio,
  normalizeFolio,
  REPORT_PHOTO_ERROR_MESSAGE,
} from '@repo/types';
import {
  CIRCUIT_BREAKER_POWERS,
  CIRCUIT_BREAKER_TEST_RESULTS,
} from './circuit-breaker';
import {
  isMissingPhoto,
  isValidStoredPhoto,
  REPORT_PHOTO_REQUIRED_MESSAGE,
} from './report-photo';

const THREE_DIGITS = /^\d{3}$/;
const TWELVE_DIGITS = /^\d{12}$/;
const TWO_DIGITS = /^\d{2}$/;

const METER_TYPES_WITH_KEY = ['cbe', 'linky'];

export function oldMeterRequiresKey(oldMeter: {
  type?: string;
  preserved?: boolean;
  linkyRefusal?: boolean;
}): boolean {
  if (oldMeter.preserved) {
    return false;
  }
  return METER_TYPES_WITH_KEY.includes(oldMeter.type ?? '');
}

const SATISFACTION_LEVELS = ['0', '1', '2', '3', '4'];

const addPhotoIssues = (
  value: unknown,
  ctx: z.RefinementCtx,
  path: (string | number)[],
  required: boolean
) => {
  if (isMissingPhoto(value)) {
    if (required) {
      ctx.addIssue({
        path,
        message: REPORT_PHOTO_REQUIRED_MESSAGE,
        code: 'custom',
      });
    }
    return;
  }

  if (!isValidStoredPhoto(value)) {
    ctx.addIssue({ path, message: REPORT_PHOTO_ERROR_MESSAGE, code: 'custom' });
  }
};

const requiredPhotoSchema = z
  .any()
  .superRefine((value, ctx) => addPhotoIssues(value, ctx, [], true));

const optionalPhotoSchema = z
  .any()
  .superRefine((value, ctx) => addPhotoIssues(value, ctx, [], false));

const newMeterSchema = z.object({
  generation: z.string().min(1, { message: 'La génération est requise' }),
  serialNumber: z.string().regex(TWELVE_DIGITS, {
    message: 'Le matricule doit contenir exactement 12 chiffres',
  }),
  key: z.string().regex(TWO_DIGITS, {
    message: 'La clé doit contenir exactement 2 chiffres',
  }),
  dayIndex: z.string().min(1, { message: "L'index jour est requis" }),
  nightIndex: z.string().optional(),
  indexPhoto: requiredPhotoSchema,
});

const skippedNewMeterSchema = z.object({
  generation: z.string().optional(),
  serialNumber: z.string().optional(),
  key: z.string().optional(),
  dayIndex: z.string().optional(),
  nightIndex: z.string().optional(),
  indexPhoto: z.any().optional(),
});

const completedDerivationSectionsSchema = z.object({
  clientInfo: z.object({
    name: z.string().min(2, { message: 'Le nom est requis' }),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Numéro de téléphone invalide' }),
    folio: z
      .string()
      .min(1, { message: 'Le folio est requis' })
      .refine(isValidFolio, {
        message:
          'Format attendu : 5 segments séparés par des tirets (ex. SGX001 - COM001 - ASC001 - 001 - 101)',
      })
      .transform(normalizeFolio),
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
    photo: requiredPhotoSchema,
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
      indexPhoto: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      addPhotoIssues(data.indexPhoto, ctx, ['indexPhoto'], !data.preserved);

      if (data.type === 'linky' && !data.generation) {
        ctx.addIssue({
          path: ['generation'],
          message: "La génération est requise lorsque le type est 'linky'",
          code: 'custom',
        });
      }

      if (oldMeterRequiresKey(data)) {
        if (!data.serialNumber || !TWELVE_DIGITS.test(data.serialNumber)) {
          ctx.addIssue({
            path: ['serialNumber'],
            message: 'Le matricule doit contenir exactement 12 chiffres',
            code: 'custom',
          });
        }
        if (!data.key || !TWO_DIGITS.test(data.key)) {
          ctx.addIssue({
            path: ['key'],
            message: 'La clé doit contenir exactement 2 chiffres',
            code: 'custom',
          });
        }
      } else if (data.serialNumber && !THREE_DIGITS.test(data.serialNumber)) {
        ctx.addIssue({
          path: ['serialNumber'],
          message: 'Le matricule doit contenir exactement 3 chiffres',
          code: 'custom',
        });
      }
    }),

  newDerivation: z.object({
    section: z.string().min(1, { message: 'La section est requise' }),
    cableType: z.string().min(1, { message: 'La nature du câble est requise' }),
    length: z.number().min(0, { message: 'La longueur doit être positive' }),
  }),

  circuitBreaker: z
    .object({
      preserved: z.boolean(),
      voltage: z.preprocess(
        (val) => (val === undefined ? '' : val),
        z
          .string()
          .min(1, { message: 'La tension est requise' })
          .refine((val) => val === 'mono' || val === 'tri', {
            message: 'La tension doit être "mono" ou "tri"',
          })
      ),
      brand: z.string().min(1, { message: 'La marque est requise' }),
      type: z.preprocess(
        (val) => (val === undefined ? '' : val),
        z
          .string()
          .min(1, { message: 'Le type est requis' })
          .refine(
            (val) =>
              val === 'non_differentiel' ||
              val === 'differentiel' ||
              val === 'selectif',
            { message: 'Le type doit être sélectionné' }
          )
      ),
      power: z.enum(CIRCUIT_BREAKER_POWERS, {
        errorMap: () => ({
          message: 'La puissance du disjoncteur est requise',
        }),
      }),
      calibrationPower: z
        .string({
          required_error: 'La puissance du calibrage est requise',
          invalid_type_error: 'La puissance du calibrage est requise',
        })
        .min(1, 'La puissance du calibrage est requise'),
      commissioningDone: z.boolean(),
      sealed: z.boolean().refine((val) => val === true, {
        message: 'Le plombage du disjoncteur est obligatoire',
      }),
      testButton: z.enum(CIRCUIT_BREAKER_TEST_RESULTS).nullable(),
      replacementExplanation: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.preserved && data.testButton === null) {
        ctx.addIssue({
          path: ['testButton'],
          message: 'Le résultat du test du bouton « TEST » est requis',
          code: 'custom',
        });
      }

      if (
        data.testButton === 'faulty' &&
        data.replacementExplanation.trim() === ''
      ) {
        ctx.addIssue({
          path: ['replacementExplanation'],
          message: 'Expliquez pourquoi le disjoncteur est à remplacer',
          code: 'custom',
        });
      }
    }),

  photoAfterWork: z.object({
    photo: requiredPhotoSchema,
    secondPhoto: optionalPhotoSchema,
    thirdPhoto: optionalPhotoSchema,
  }),

  clientValidation: z
    .object({
      present: z.boolean(),
      workValidation: z.boolean().optional(),
      satisfactionLevel: z.string().optional(),
      clientComment: z.string().optional(),
      signature: z.any().optional(),
      technicianComment: z.string(),
      technicianNothingToReport: z.boolean(),
      technicianSignature: z.string().nullable(),
    })
    .superRefine((data, ctx) => {
      if (!data.technicianNothingToReport && !data.technicianComment.trim()) {
        ctx.addIssue({
          path: ['technicianComment'],
          message: 'Le commentaire est requis, sinon cochez « RAS »',
          code: 'custom',
        });
      }

      if (!data.technicianSignature) {
        ctx.addIssue({
          path: ['technicianSignature'],
          message: 'La signature du technicien est requise',
          code: 'custom',
        });
      }

      if (!data.present) {
        return;
      }

      if (typeof data.workValidation !== 'boolean') {
        ctx.addIssue({
          path: ['workValidation'],
          message: 'La validation des travaux est requise',
          code: 'custom',
        });
      }

      if (!SATISFACTION_LEVELS.includes(data.satisfactionLevel ?? '')) {
        ctx.addIssue({
          path: ['satisfactionLevel'],
          message: 'Le niveau de satisfaction est requis',
          code: 'custom',
        });
      }

      if (!data.signature) {
        ctx.addIssue({
          path: ['signature'],
          message: 'La signature du client est requise lorsqu’il est présent',
          code: 'custom',
        });
      }
    }),
});

export const createCompletedDerivationSchema =
  completedDerivationSectionsSchema.extend({ newMeter: newMeterSchema });

const completedDerivationWithoutNewMeterSchema =
  completedDerivationSectionsSchema.extend({
    newMeter: skippedNewMeterSchema,
  });

export const getCompletedDerivationSchema = (oldMeter: OldMeterOutcome) =>
  isNewMeterInstalled(oldMeter)
    ? createCompletedDerivationSchema
    : completedDerivationWithoutNewMeterSchema;
