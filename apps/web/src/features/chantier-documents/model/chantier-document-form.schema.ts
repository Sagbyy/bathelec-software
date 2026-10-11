import { z } from 'zod';
import { ChantierDocumentType } from '@repo/types';

export const CHANTIER_DOCUMENT_ACCEPTED_MIME_TYPES: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const CHANTIER_DOCUMENT_ACCEPT_ATTRIBUTE =
  'application/pdf,image/jpeg,image/png,image/webp';

export const CHANTIER_DOCUMENT_MAX_FILE_SIZE = 10 * 1024 * 1024;

const BASE64_MARKER = ';base64,';

function parseDataUrl(
  value: string
): { mimeType: string; base64: string } | null {
  if (!value.startsWith('data:')) return null;

  const markerIndex = value.indexOf(BASE64_MARKER);
  if (markerIndex === -1) return null;

  const mimeType = value.slice('data:'.length, markerIndex);
  const base64 = value.slice(markerIndex + BASE64_MARKER.length);
  if (base64.length === 0) return null;

  return { mimeType, base64 };
}

function decodedByteLength(base64: string): number {
  let padding = 0;
  if (base64.endsWith('==')) padding = 2;
  else if (base64.endsWith('=')) padding = 1;

  return Math.floor((base64.length * 3) / 4) - padding;
}

export function isAcceptedChantierDocumentFile(value: string): boolean {
  const parsed = parseDataUrl(value);
  if (!parsed) return false;
  if (!CHANTIER_DOCUMENT_ACCEPTED_MIME_TYPES.includes(parsed.mimeType)) {
    return false;
  }

  return decodedByteLength(parsed.base64) <= CHANTIER_DOCUMENT_MAX_FILE_SIZE;
}

export const chantierDocumentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom doit avoir au moins 2 caractères')
    .max(120, 'Le nom doit avoir au maximum 120 caractères'),
  type: z.nativeEnum(ChantierDocumentType, {
    errorMap: () => ({ message: 'Veuillez sélectionner un type' }),
  }),
  file: z
    .string()
    .min(1, 'Veuillez sélectionner un fichier')
    .refine(isAcceptedChantierDocumentFile, {
      message:
        'Fichier invalide : PDF ou image (jpeg, png, webp) de 10 Mo maximum',
    }),
});

export type ChantierDocumentFormValues = z.infer<
  typeof chantierDocumentFormSchema
>;
