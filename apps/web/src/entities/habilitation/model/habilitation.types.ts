export interface HabilitationCodes {
  b0: boolean;
  bs: boolean;
  be: boolean;
  h0: boolean;
  h0v: boolean;
  b1: boolean;
  b1v: boolean;
  h1: boolean;
  h1v: boolean;
  b2: boolean;
  b2v: boolean;
  b2vEssais: boolean;
  h2: boolean;
  h2v: boolean;
  h2vEssais: boolean;
  bc: boolean;
  hc: boolean;
  br: boolean;
  beAttribut: boolean;
  heAttribut: boolean;
}

export type HabilitationKey = keyof HabilitationCodes;

export interface HabilitationDocument extends HabilitationCodes {
  _id?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateHabilitationDto = Partial<HabilitationCodes>;

export const DEFAULT_HABILITATIONS: HabilitationCodes = {
  b0: false,
  bs: false,
  be: false,
  h0: false,
  h0v: false,
  b1: false,
  b1v: false,
  h1: false,
  h1v: false,
  b2: false,
  b2v: false,
  b2vEssais: false,
  h2: false,
  h2v: false,
  h2vEssais: false,
  bc: false,
  hc: false,
  br: false,
  beAttribut: false,
  heAttribut: false,
};

export interface TableCell {
  codes: HabilitationKey[];
  labels: string[];
}

export const HABILITATION_TABLE: {
  columns: { key: string; label: string; colspan?: number }[];
  rows: { tension: string; cells: (TableCell | null)[] }[];
} = {
  columns: [
    { key: 'tension', label: '' },
    { key: 'nonElec1', label: 'Op. non électrique (1)' },
    { key: 'nonElec2', label: 'Op. non électrique (2)' },
    { key: 'executant', label: 'Exécutant' },
    { key: 'chargedTravaux', label: 'Chargé de travaux' },
    { key: 'chargedConsig', label: 'Chargé de consignation' },
    { key: 'chargedInterv', label: "Chargé d'intervention" },
    { key: 'chargedOp', label: "Chargé d'opérations" },
  ],
  rows: [
    {
      tension: 'Basse tension',
      cells: [
        { codes: ['b0'], labels: ['B0'] },
        { codes: ['bs', 'be'], labels: ['BS', 'BE'] },
        { codes: ['b1', 'b1v'], labels: ['B1', 'B1V'] },
        {
          codes: ['b2', 'b2v', 'b2vEssais'],
          labels: ['B2', 'B2V', 'B2V essais'],
        },
        { codes: ['bc'], labels: ['BC'] },
        { codes: ['bs', 'br'], labels: ['BS', 'BR'] },
        { codes: ['beAttribut'], labels: ['BE + attribut'] },
      ],
    },
    {
      tension: 'Haute tension',
      cells: [
        { codes: ['h0', 'h0v'], labels: ['H0', 'H0V'] },
        null,
        { codes: ['h1', 'h1v'], labels: ['H1', 'H1V'] },
        {
          codes: ['h2', 'h2v', 'h2vEssais'],
          labels: ['H2', 'H2V', 'H2V essais'],
        },
        { codes: ['hc'], labels: ['HC'] },
        null,
        { codes: ['heAttribut'], labels: ['HE + attribut'] },
      ],
    },
  ],
};
