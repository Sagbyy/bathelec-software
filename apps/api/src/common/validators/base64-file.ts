import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

const BASE64_MARKER = ';base64,';
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

export interface ParsedBase64 {
  mimeType: string;
  base64Data: string;
}

export function parseBase64DataUrl(value: string): ParsedBase64 | null {
  if (typeof value !== 'string' || !value.startsWith('data:')) return null;

  const markerIndex = value.indexOf(BASE64_MARKER);
  if (markerIndex === -1) return null;

  const mimeType = value.slice('data:'.length, markerIndex);
  const base64Data = value.slice(markerIndex + BASE64_MARKER.length);

  if (base64Data.length === 0 || !BASE64_PATTERN.test(base64Data)) return null;

  return { mimeType, base64Data };
}

export function decodedByteLength(base64Data: string): number {
  let padding = 0;
  if (base64Data.endsWith('==')) padding = 2;
  else if (base64Data.endsWith('=')) padding = 1;

  return Math.floor((base64Data.length * 3) / 4) - padding;
}

export function isAllowedBase64File(
  value: string,
  allowedMimeTypes: Set<string>,
  maxBytes: number
): boolean {
  const parsed = parseBase64DataUrl(value);
  if (!parsed) return false;
  if (!allowedMimeTypes.has(parsed.mimeType)) return false;

  return decodedByteLength(parsed.base64Data) <= maxBytes;
}

export function registerBase64Decorator(
  object: object,
  propertyName: string,
  validationOptions: ValidationOptions | undefined,
  validator: new () => ValidatorConstraintInterface
): void {
  registerDecorator({
    target: object.constructor,
    propertyName,
    options: validationOptions,
    constraints: [],
    validator,
  });
}
