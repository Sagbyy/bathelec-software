import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_BASE64_LENGTH = 10 * 1024 * 1024;

@ValidatorConstraint({ name: 'isBase64Document', async: false })
export class IsBase64DocumentConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (typeof value !== 'string') return false;

    const match = value.match(
      /^data:([a-zA-Z0-9+/]+\/[a-zA-Z0-9+/.-]+);base64,([A-Za-z0-9+/]+=*)$/
    );
    if (!match) return false;

    const [, mimeType, base64Data] = match;

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) return false;
    if (base64Data.length > MAX_BASE64_LENGTH) return false;

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
