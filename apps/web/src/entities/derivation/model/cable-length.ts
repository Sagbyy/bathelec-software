export const CABLE_SECTIONS = ['2x16', '2x25', '2x35'] as const;

export type CableSection = (typeof CABLE_SECTIONS)[number];

interface CableLengthRange {
  min: number;
  max: number | null;
}

export const CABLE_LENGTH_RANGES: Record<CableSection, CableLengthRange> = {
  '2x16': { min: 0, max: 10 },
  '2x25': { min: 11, max: 20 },
  '2x35': { min: 21, max: null },
};

export function isCableLengthValidForSection(
  length: number,
  section: string
): boolean {
  const range = CABLE_LENGTH_RANGES[section as CableSection];

  if (!range) {
    return true;
  }

  if (length < range.min) {
    return false;
  }

  return range.max === null || length <= range.max;
}
