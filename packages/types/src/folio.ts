export const FOLIO_SEGMENT_COUNT = 5;

export const FOLIO_PATTERN = /^\s*[A-Za-z0-9]+(\s*-\s*[A-Za-z0-9]+){4}\s*$/;

export const isValidFolio = (value: string) => FOLIO_PATTERN.test(value);

export const normalizeFolio = (value: string) =>
  value
    .split('-')
    .map((segment) => segment.trim().toUpperCase())
    .join(' - ');
