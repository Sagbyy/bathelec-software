import { CompletedDerivation } from '../../completed-derivation/entities/completed-derivations.entity';
import {
  BREAKER_TYPE_LABELS,
  CABLE_NATURE_LABELS,
  METER_GENERATION_LABELS,
  METER_TYPE_LABELS,
  VOLTAGE_LABELS,
  formatInterventionDate,
  toEnedisLabel,
} from './enedis-labels';

export type EnedisExportChantier = {
  address: string;
  enedisAffaireNumber: string;
  internalAffaireNumber: string;
  market?: { name: string } | null;
};

export type EnedisExportSource = {
  derivationId: number;
  performedBy: string;
  chantier: EnedisExportChantier | null;
  report: Pick<
    CompletedDerivation,
    | 'clientInfo'
    | 'generalInfo'
    | 'oldMeter'
    | 'newDerivation'
    | 'newMeter'
    | 'circuitBreaker'
    | 'clientValidation'
  >;
};

export type EnedisCellValue = string | number;

export type EnedisColumn = {
  header: string;
  width: number;
  value: (source: EnedisExportSource) => EnedisCellValue;
};

const yesNo = (value: boolean | undefined) => (value ? 'Oui' : 'Non');

const newMeterValue = (
  { report }: EnedisExportSource,
  value: (newMeter: EnedisExportSource['report']['newMeter']) => string
) =>
  report.oldMeter.preserved || !report.newMeter ? '' : value(report.newMeter);

const withUnit = (value: string | undefined, unit: string) =>
  value ? `${value.replace(/\s*A$/i, '')} ${unit}` : '';

export const describeTestButton = ({
  preserved,
  testButton,
  replacementExplanation,
}: EnedisExportSource['report']['circuitBreaker']) => {
  if (!preserved) return 'Non concerné (disjoncteur remplacé)';
  if (testButton === 'working') return 'Fonctionne — disjoncteur conservé';
  if (testButton === 'faulty') {
    return `HS — disjoncteur à remplacer${
      replacementExplanation ? ` : ${replacementExplanation}` : ''
    }`;
  }
  return 'Non renseigné';
};

export const describeTechnicianComment = ({
  technicianNothingToReport,
  technicianComment,
}: EnedisExportSource['report']['clientValidation']) =>
  technicianNothingToReport ? 'RAS' : technicianComment;

export const TECHNICIAN_SIGNATURE_HEADER = 'Signature technicien';

export const ENEDIS_COLUMNS: EnedisColumn[] = [
  {
    header: "N° d'affaire Enedis",
    width: 18,
    value: ({ chantier }) => chantier?.enedisAffaireNumber ?? '',
  },
  {
    header: "N° d'affaire interne",
    width: 18,
    value: ({ chantier }) => chantier?.internalAffaireNumber ?? '',
  },
  {
    header: 'Folio',
    width: 38,
    value: ({ report }) => report.clientInfo.folio,
  },
  {
    header: 'Identification CM',
    width: 16,
    value: ({ report }) => report.generalInfo.cmIdentification,
  },
  {
    header: 'Client',
    width: 24,
    value: ({ report }) => report.clientInfo.name,
  },
  {
    header: 'Téléphone client',
    width: 18,
    value: ({ report }) => report.clientInfo.phone,
  },
  {
    header: 'Adresse',
    width: 40,
    value: ({ report }) => {
      const { street, postalCode, city } = report.generalInfo.address;
      return `${street}, ${postalCode} ${city}`;
    },
  },
  {
    header: 'Bâtiment / étage / palier',
    width: 26,
    value: ({ report }) =>
      [
        report.generalInfo.building,
        report.generalInfo.floor,
        report.generalInfo.situation,
      ]
        .filter(Boolean)
        .join(' / '),
  },
  {
    header: "Date et heure d'intervention",
    width: 18,
    value: ({ report }) => formatInterventionDate(report.generalInfo.dateTime),
  },
  {
    header: 'Réalisé par',
    width: 22,
    value: ({ performedBy }) => performedBy,
  },
  {
    header: 'Commentaire intervention',
    width: 30,
    value: ({ report }) => report.generalInfo.comment ?? '',
  },
  {
    header: 'Ancien compteur — type',
    width: 18,
    value: ({ report }) =>
      toEnedisLabel(METER_TYPE_LABELS, report.oldMeter.type),
  },
  {
    header: 'Ancien compteur — génération',
    width: 14,
    value: ({ report }) =>
      toEnedisLabel(METER_GENERATION_LABELS, report.oldMeter.generation),
  },
  {
    header: 'Ancien compteur — matricule',
    width: 18,
    value: ({ report }) => report.oldMeter.serialNumber ?? '',
  },
  {
    header: 'Ancien compteur — clé',
    width: 10,
    value: ({ report }) => report.oldMeter.key ?? '',
  },
  {
    header: 'Ancien compteur — conservé',
    width: 12,
    value: ({ report }) => yesNo(report.oldMeter.preserved),
  },
  {
    header: 'Nouveau compteur — type',
    width: 18,
    value: (source) => newMeterValue(source, () => METER_TYPE_LABELS.linky),
  },
  {
    header: 'Nouveau compteur — génération',
    width: 14,
    value: (source) =>
      newMeterValue(source, ({ generation }) =>
        toEnedisLabel(METER_GENERATION_LABELS, generation)
      ),
  },
  {
    header: 'Nouveau compteur — matricule',
    width: 18,
    value: (source) =>
      newMeterValue(source, ({ serialNumber }) => serialNumber ?? ''),
  },
  {
    header: 'Nouveau compteur — clé',
    width: 10,
    value: (source) => newMeterValue(source, ({ key }) => key ?? ''),
  },
  {
    header: 'Ancien compteur — index HP',
    width: 14,
    value: ({ report }) => report.oldMeter.dayIndex ?? '',
  },
  {
    header: 'Ancien compteur — index HC',
    width: 14,
    value: ({ report }) => report.oldMeter.nightIndex ?? '',
  },
  {
    header: 'Nouveau compteur — index HP',
    width: 14,
    value: (source) => newMeterValue(source, ({ dayIndex }) => dayIndex ?? ''),
  },
  {
    header: 'Nouveau compteur — index HC',
    width: 14,
    value: (source) =>
      newMeterValue(source, ({ nightIndex }) => nightIndex ?? ''),
  },
  {
    header: 'Câble — section (mm²)',
    width: 14,
    value: ({ report }) => report.newDerivation.section,
  },
  {
    header: 'Câble — nature',
    width: 14,
    value: ({ report }) =>
      toEnedisLabel(CABLE_NATURE_LABELS, report.newDerivation.cableType),
  },
  {
    header: 'Câble — longueur (m)',
    width: 14,
    value: ({ report }) => report.newDerivation.length,
  },
  {
    header: 'Disjoncteur — conservé',
    width: 12,
    value: ({ report }) => yesNo(report.circuitBreaker.preserved),
  },
  {
    header: 'Disjoncteur — voltage',
    width: 14,
    value: ({ report }) =>
      toEnedisLabel(VOLTAGE_LABELS, report.circuitBreaker.voltage),
  },
  {
    header: 'Disjoncteur — marque',
    width: 16,
    value: ({ report }) => report.circuitBreaker.brand,
  },
  {
    header: 'Disjoncteur — type',
    width: 16,
    value: ({ report }) =>
      toEnedisLabel(BREAKER_TYPE_LABELS, report.circuitBreaker.type),
  },
  {
    header: 'Disjoncteur — mise en service',
    width: 14,
    value: ({ report }) => yesNo(report.circuitBreaker.commissioningDone),
  },
  {
    header: 'Disjoncteur — plombage',
    width: 12,
    value: ({ report }) => yesNo(report.circuitBreaker.sealed),
  },
  {
    header: 'Client présent',
    width: 12,
    value: ({ report }) => yesNo(report.clientValidation.present),
  },
  {
    header: 'Travaux validés par le client',
    width: 14,
    value: ({ report }) =>
      report.clientValidation.present
        ? yesNo(report.clientValidation.workValidation)
        : '',
  },
  {
    header: 'Satisfaction client (0-4)',
    width: 14,
    value: ({ report }) =>
      report.clientValidation.present
        ? report.clientValidation.satisfactionLevel
        : '',
  },
  {
    header: 'Commentaire client',
    width: 30,
    value: ({ report }) =>
      report.clientValidation.present
        ? (report.clientValidation.clientComment ?? '')
        : '',
  },
  {
    header: 'Puissance disjoncteur',
    width: 16,
    value: ({ report }) => withUnit(report.circuitBreaker.power, 'A'),
  },
  {
    header: 'Puissance calibrage',
    width: 16,
    value: ({ report }) =>
      withUnit(report.circuitBreaker.calibrationPower, 'A'),
  },
  {
    header: 'Bouton test disjoncteur',
    width: 40,
    value: ({ report }) => describeTestButton(report.circuitBreaker),
  },
  {
    header: 'RAS technicien',
    width: 12,
    value: ({ report }) =>
      yesNo(report.clientValidation.technicianNothingToReport),
  },
  {
    header: 'Commentaire électricien',
    width: 30,
    value: ({ report }) => describeTechnicianComment(report.clientValidation),
  },
  {
    header: TECHNICIAN_SIGNATURE_HEADER,
    width: 24,
    value: ({ report }) =>
      report.clientValidation.technicianSignature ? '' : 'Non signée',
  },
];

export const buildEnedisRow = (source: EnedisExportSource) =>
  ENEDIS_COLUMNS.map((column) => column.value(source));
