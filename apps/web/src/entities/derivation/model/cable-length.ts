export const CABLE_SECTIONS = ['2x16', '2x25', '2x35'] as const;

export type CableSection = (typeof CABLE_SECTIONS)[number];

export const CABLE_SECTION_MAX_LENGTHS: Record<CableSection, number> = {
  '2x16': 10,
  '2x25': 20,
  '2x35': 20,
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

  return length <= CABLE_SECTION_MAX_LENGTHS[section];
}
