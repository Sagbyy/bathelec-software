import { z } from 'zod';

const baseUser = {
  user: z
    .string()
    .min(2, {
      message: "Le nom d'utilisateur doit comporter au moins 2 caractères",
    })
    .max(50, {
      message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
    }),
};

const nonBlankPart = {
  isBlank: z.literal(false),
  address: z
    .string()
    .min(5, { message: "L'adresse doit comporter au moins 5 caractères" })
    .max(100, { message: "L'adresse ne peut pas dépasser 100 caractères" }),
  postalCode: z.string().regex(/^\d{5}$/, {
    message: 'Le code postal doit contenir exactement 5 chiffres',
  }),
  city: z
    .string()
    .min(2, {
      message: 'Le nom de la ville doit comporter au moins 2 caractères',
    })
    .max(50, {
      message: 'Le nom de la ville ne peut pas dépasser 50 caractères',
    }),
};

const blankPart = {
  isBlank: z.literal(true),
  address: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
};

export const formSchema = z.discriminatedUnion('isBlank', [
  z.object({ ...baseUser, ...nonBlankPart }),
  z.object({ ...baseUser, ...blankPart }),
]);
