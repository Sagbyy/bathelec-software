export const CABLE_SECTIONS = ['2x16', '2x25', '2x35'] as const;

export type CableSection = (typeof CABLE_SECTIONS)[number];

const CABLE_SECTION_MAX_LENGTHS: Record<CableSection, number | null> = {
  '2x16': 10,
  '2x25': 20,
  '2x35': null,
};

function isCableSection(section: string): section is CableSection {
  return (CABLE_SECTIONS as readonly string[]).includes(section);
}

export function isCableLengthValidForSection(
  length: number,
  section: string
): boolean {
  if (!isCableSection(section)) {
    return true;
  }

  const index = CABLE_SECTIONS.indexOf(section);
  const previousSection = index > 0 ? CABLE_SECTIONS[index - 1] : null;
  const lowerExclusive = previousSection
    ? CABLE_SECTION_MAX_LENGTHS[previousSection]
    : null;
  const upperInclusive = CABLE_SECTION_MAX_LENGTHS[section];

  if (lowerExclusive !== null && length <= lowerExclusive) {
    return false;
  }

  return upperInclusive === null || length <= upperInclusive;
}
