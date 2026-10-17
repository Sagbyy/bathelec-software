import {
  ENEDIS_COLUMNS,
  EnedisExportSource,
  buildEnedisRow,
  describeTechnicianComment,
  describeTestButton,
} from './enedis-export.columns';
import { buildSource } from './enedis-export.fixtures';

const valueOf = (source: EnedisExportSource, header: string) =>
  buildEnedisRow(source)[
    ENEDIS_COLUMNS.findIndex((column) => column.header === header)
  ];

describe('Enedis export columns', () => {
  it('starts with the Enedis and internal affaire numbers, then the folio', () => {
    expect(ENEDIS_COLUMNS.slice(0, 3).map(({ header }) => header)).toEqual([
      "N° d'affaire Enedis",
      "N° d'affaire interne",
      'Folio',
    ]);
  });

  it('adds the DTA-56 fields at the end of the table', () => {
    expect(ENEDIS_COLUMNS.slice(-6).map(({ header }) => header)).toEqual([
      'Puissance disjoncteur',
      'Puissance calibrage',
      'Bouton test disjoncteur',
      'RAS technicien',
      'Commentaire électricien',
      'Signature technicien',
    ]);
  });

  it('maps a full report to one row', () => {
    const row = buildEnedisRow(buildSource());

    expect(row).toHaveLength(ENEDIS_COLUMNS.length);
    expect(row.slice(0, 7)).toEqual([
      'DC21/014312',
      'BA570035',
      'SGX001 - COM001 - ASC001 - 001 - 101',
      '1D001',
      'DUPONT',
      '+33612345678',
      '3 rue Paillet, 75005 Paris',
    ]);
  });

  it('expresses powers in amperes', () => {
    const source = buildSource();

    expect(valueOf(source, 'Puissance disjoncteur')).toBe('15-45 A');
    expect(valueOf(source, 'Puissance calibrage')).toBe('45 A');
  });

  it('uses business labels for voltage and breaker type', () => {
    const source = buildSource();

    expect(valueOf(source, 'Disjoncteur — voltage')).toBe('Monophasé');
    expect(valueOf(source, 'Disjoncteur — type')).toBe('Sélectif');
  });

  it('leaves the new meter empty when the old meter is preserved', () => {
    const source = buildSource({
      oldMeter: { ...buildSource().report.oldMeter, preserved: true },
    });

    expect(valueOf(source, 'Nouveau compteur — matricule')).toBe('');
  });

  it('flags a missing technician signature', () => {
    const base = buildSource().report.clientValidation;
    const source = buildSource({
      clientValidation: { ...base, technicianSignature: undefined },
    });

    expect(valueOf(source, 'Signature technicien')).toBe('Non signée');
  });
});

describe('describeTestButton', () => {
  const breaker = buildSource().report.circuitBreaker;

  it('describes a working test button', () => {
    expect(describeTestButton(breaker)).toBe(
      'Fonctionne — disjoncteur conservé'
    );
  });

  it('describes a faulty test button with its explanation', () => {
    expect(
      describeTestButton({
        ...breaker,
        testButton: 'faulty',
        replacementExplanation: 'Bouton bloqué',
      })
    ).toBe('HS — disjoncteur à remplacer : Bouton bloqué');
  });

  it('marks the test as not applicable when the breaker is replaced', () => {
    expect(describeTestButton({ ...breaker, preserved: false })).toBe(
      'Non concerné (disjoncteur remplacé)'
    );
  });

  it('flags a preserved breaker without test result', () => {
    expect(describeTestButton({ ...breaker, testButton: null })).toBe(
      'Non renseigné'
    );
  });
});

describe('describeTechnicianComment', () => {
  const validation = buildSource().report.clientValidation;

  it('writes RAS when the technician has nothing to report', () => {
    expect(describeTechnicianComment(validation)).toBe('RAS');
  });

  it('writes the comment otherwise', () => {
    expect(
      describeTechnicianComment({
        ...validation,
        technicianNothingToReport: false,
        technicianComment: 'Câble repris',
      })
    ).toBe('Câble repris');
  });
});
