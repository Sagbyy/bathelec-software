import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BASE64_MARKER = ';base64,';
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

export function decodedByteLength(base64Data: string): number {
  const padding = base64Data.endsWith('==')
    ? 2
    : base64Data.endsWith('=')
      ? 1
      : 0;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

@ValidatorConstraint({ name: 'isBase64Document', async: false })
export class IsBase64DocumentConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (typeof value !== 'string') return false;
    if (!value.startsWith('data:')) return false;

    const markerIndex = value.indexOf(BASE64_MARKER);
    if (markerIndex === -1) return false;

    const mimeType = value.slice('data:'.length, markerIndex);
    const base64Data = value.slice(markerIndex + BASE64_MARKER.length);

    if (!ALLOWED_MIME_TYPES.has(mimeType)) return false;
    if (base64Data.length === 0) return false;
    if (!BASE64_PATTERN.test(base64Data)) return false;
    if (decodedByteLength(base64Data) > MAX_FILE_SIZE) return false;

    return true;
  }

  defaultMessage(): string {
    return 'Le fichier doit être un PDF ou une image (jpeg, png, webp) encodé en base64 et ne pas dépasser 10MB';
  }
}

export function IsBase64Document(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64DocumentConstraint,
    });
  };
}
