import { describe, it, expect } from 'vitest';
import { ChantierDocumentType } from '@repo/types';
import {
  chantierDocumentFormSchema,
  isAcceptedChantierDocumentFile,
  CHANTIER_DOCUMENT_MAX_FILE_SIZE,
} from './chantier-document-form.schema';

const smallPdf = 'data:application/pdf;base64,JVBERi0xLjQ=';

function dataUrlOfSize(mimeType: string, bytes: number): string {
  const base64Length = Math.ceil(bytes / 3) * 4;
  return `data:${mimeType};base64,${'A'.repeat(base64Length)}`;
}

describe('isAcceptedChantierDocumentFile', () => {
  it.each([
    'data:application/pdf;base64,JVBERi0=',
    'data:image/jpeg;base64,/9j/4AAQ',
    'data:image/png;base64,iVBORw0KGgo=',
    'data:image/webp;base64,UklGRlY=',
  ])('accepts an allowed type: %s', (value) => {
    expect(isAcceptedChantierDocumentFile(value)).toBe(true);
  });

  it.each([
    ['disallowed svg', 'data:image/svg+xml;base64,PHN2Zy8+'],
    ['missing base64 marker', 'data:application/pdf,JVBERi0='],
    ['not a data url', 'hello'],
    ['empty payload', 'data:application/pdf;base64,'],
  ])('rejects %s', (_label, value) => {
    expect(isAcceptedChantierDocumentFile(value)).toBe(false);
  });

  it('rejects a file over 10 MB', () => {
    const tooBig = dataUrlOfSize(
      'application/pdf',
      CHANTIER_DOCUMENT_MAX_FILE_SIZE + 1024
    );
    expect(isAcceptedChantierDocumentFile(tooBig)).toBe(false);
  });

  it('accepts a file within 10 MB', () => {
    const ok = dataUrlOfSize('application/pdf', 1024);
    expect(isAcceptedChantierDocumentFile(ok)).toBe(true);
  });
});

describe('chantierDocumentFormSchema', () => {
  it('validates a correct payload', () => {
    const result = chantierDocumentFormSchema.safeParse({
      name: 'Étude de marché',
      type: ChantierDocumentType.MARKET_STUDY,
      file: smallPdf,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a too-short name', () => {
    const result = chantierDocumentFormSchema.safeParse({
      name: 'a',
      type: ChantierDocumentType.OTHER,
      file: smallPdf,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid type', () => {
    const result = chantierDocumentFormSchema.safeParse({
      name: 'Document',
      type: 'not_a_type',
      file: smallPdf,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing file', () => {
    const result = chantierDocumentFormSchema.safeParse({
      name: 'Document',
      type: ChantierDocumentType.OTHER,
      file: '',
    });
    expect(result.success).toBe(false);
  });
});
