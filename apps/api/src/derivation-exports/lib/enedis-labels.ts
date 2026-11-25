export type EnedisLabels = Record<string, string>;

export const METER_TYPE_LABELS: EnedisLabels = {
  electromecanique: 'Électromécanique',
  cbe: 'CBE (Compteur Bleu Électronique)',
  linky: 'Linky',
  other: 'Autre',
};

export const METER_GENERATION_LABELS: EnedisLabels = {
  g1: 'Linky G1',
  g2: 'Linky G2',
  g3: 'Linky G3',
};

export const CABLE_NATURE_LABELS: EnedisLabels = {
  cuivre: 'Cuivre',
  aluminium: 'Aluminium',
};

export const VOLTAGE_LABELS: EnedisLabels = {
  mono: 'Monophasé',
  tri: 'Triphasé',
};

export const BREAKER_TYPE_LABELS: EnedisLabels = {
  non_differentiel: 'Non différentiel',
  differentiel: 'Différentiel',
  selectif: 'Sélectif',
};

export const toEnedisLabel = (
  labels: EnedisLabels,
  code: string | null | undefined
) => {
  if (!code) return '';
  return labels[code.trim().toLowerCase()] ?? code;
};

const INTERVENTION_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatInterventionDate = (
  value: Date | string | null | undefined
) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : INTERVENTION_DATE_FORMAT.format(date).replace(',', '');
};
