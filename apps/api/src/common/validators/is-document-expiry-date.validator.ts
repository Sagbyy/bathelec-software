import { applyDecorators } from '@nestjs/common';
import { IsDateString, ValidateIf } from 'class-validator';

export const expiryKeyOf = <K extends string>(documentKey: K) =>
  `${documentKey}ExpiresAt` as const;

const isExpiryDateRequired = (
  dto: Record<string, unknown>,
  documentKey: string,
  expiryKey: string
) => {
  const isDocumentRemoved = dto[documentKey] === null;
  const isDocumentProvided = typeof dto[documentKey] === 'string';
  const isExpiryTouched = dto[expiryKey] !== undefined;
  return !isDocumentRemoved && (isDocumentProvided || isExpiryTouched);
};

export function IsDocumentExpiryDate(documentKey: string) {
  const expiryKey = expiryKeyOf(documentKey);
  return applyDecorators(
    ValidateIf((dto: Record<string, unknown>) =>
      isExpiryDateRequired(dto, documentKey, expiryKey)
    ),
    IsDateString(
      {},
      {
        message: `${expiryKey} is required while ${documentKey} is kept`,
      }
    )
  );
}

export function clearExpiryOfRemovedDocuments<T extends object>(
  dto: T,
  documentKeys: readonly string[]
): T {
  const cleared: Record<string, unknown> = {
    ...(dto as Record<string, unknown>),
  };
  for (const documentKey of documentKeys) {
    if (cleared[documentKey] === null) {
      cleared[expiryKeyOf(documentKey)] = null;
    }
  }
  return cleared as T;
}
