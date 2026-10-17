import { z } from 'zod';

export const createMarketSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom du marché doit avoir au moins 2 caractères')
    .max(100, 'Le nom du marché doit avoir au maximum 100 caractères'),
});

const scheduleFields = {
  startDate: z.string(),
  endDate: z.string(),
};

type ScheduleValues = { startDate: string; endDate: string };

const validateSchedule = (
  { startDate, endDate }: ScheduleValues,
  ctx: z.RefinementCtx
) => {
  if (endDate && !startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['startDate'],
      message: 'Indiquez la date de début avant la date de fin',
    });
  }
  if (startDate && endDate && endDate < startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'La date de fin doit suivre la date de début',
    });
  }
};

export const toScheduleDto = ({ startDate, endDate }: ScheduleValues) => ({
  startDate: startDate || null,
  endDate: endDate || null,
});

export const chantierScheduleSchema = z
  .object(scheduleFields)
  .superRefine(validateSchedule);

export const createChantierSchema = z
  .object({
    address: z
      .string()
      .trim()
      .min(5, "L'adresse doit avoir au moins 5 caractères")
      .max(200, "L'adresse doit avoir au maximum 200 caractères"),
    enedisAffaireNumber: z
      .string()
      .trim()
      .min(2, 'Le numéro Enedis doit avoir au moins 2 caractères')
      .max(80, 'Le numéro Enedis doit avoir au maximum 80 caractères'),
    internalAffaireNumber: z
      .string()
      .trim()
      .min(2, 'Le numéro interne doit avoir au moins 2 caractères')
      .max(80, 'Le numéro interne doit avoir au maximum 80 caractères')
      .toUpperCase(),
    marketId: z.coerce
      .number({
        required_error: 'Veuillez sélectionner un marché',
        invalid_type_error: 'Veuillez sélectionner un marché',
      })
      .int('Veuillez sélectionner un marché')
      .positive('Veuillez sélectionner un marché'),
    ...scheduleFields,
  })
  .superRefine(validateSchedule);

export type CreateMarketFormData = z.infer<typeof createMarketSchema>;

export type CreateChantierFormData = z.infer<typeof createChantierSchema>;

export type ChantierScheduleFormData = z.infer<typeof chantierScheduleSchema>;
