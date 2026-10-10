import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  isAllowedBase64File,
  registerBase64Decorator,
} from './base64-file';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ValidatorConstraint({ name: 'isBase64Document', async: false })
export class IsBase64DocumentConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    return isAllowedBase64File(value, ALLOWED_MIME_TYPES, MAX_FILE_SIZE);
  }

  defaultMessage(): string {
    return 'Le fichier doit être un PDF ou une image (jpeg, png, webp) encodé en base64 et ne pas dépasser 10MB';
  }
}

export function IsBase64Document(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerBase64Decorator(
      object,
      propertyName,
      validationOptions,
      IsBase64DocumentConstraint
    );
  };
}
