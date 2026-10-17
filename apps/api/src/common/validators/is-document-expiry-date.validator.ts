import { applyDecorators } from '@nestjs/common';
import { IsDateString, ValidateIf } from 'class-validator';

export const expiryKeyOf = <K extends string>(documentKey: K) =>
  `${documentKey}ExpiresAt` as const;

export function IsDocumentExpiryDate(documentKey: string) {
  const expiryKey = expiryKeyOf(documentKey);
  return applyDecorators(
    ValidateIf(
      (dto: Record<string, unknown>) =>
        typeof dto[documentKey] === 'string' || dto[expiryKey] != null
    ),
    IsDateString(
      {},
      { message: `${expiryKey} is required when ${documentKey} is provided` }
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
