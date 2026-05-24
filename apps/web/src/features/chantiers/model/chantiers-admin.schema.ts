import { z } from 'zod';

export const createMarketSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom du marché doit avoir au moins 2 caractères')
    .max(100, 'Le nom du marché doit avoir au maximum 100 caractères'),
});

export const createChantierSchema = z.object({
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
    .max(80, 'Le numéro interne doit avoir au maximum 80 caractères'),
  marketId: z.coerce
    .number({
      required_error: 'Veuillez sélectionner un marché',
      invalid_type_error: 'Veuillez sélectionner un marché',
    })
    .int('Veuillez sélectionner un marché')
    .positive('Veuillez sélectionner un marché'),
});

export interface CreateMarketFormData {
  name: string;
}

export interface CreateChantierFormData {
  address: string;
  enedisAffaireNumber: string;
  internalAffaireNumber: string;
  marketId: number;
}
