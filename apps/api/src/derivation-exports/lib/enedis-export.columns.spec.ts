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

  it('follows the Enedis order from the affaire numbers to the client validation', () => {
    expect(ENEDIS_COLUMNS.map(({ header }) => header).slice(0, -6)).toEqual([
      "N° d'affaire Enedis",
      "N° d'affaire interne",
      'Folio',
      'Identification CM',
      'Client',
      'Téléphone client',
      'Adresse',
      'Bâtiment / étage / palier',
      "Date et heure d'intervention",
      'Réalisé par',
      'Commentaire intervention',
      'Ancien compteur — type',
      'Ancien compteur — génération',
      'Ancien compteur — matricule',
      'Ancien compteur — clé',
      'Ancien compteur — conservé',
      'Nouveau compteur — type',
      'Nouveau compteur — génération',
      'Nouveau compteur — matricule',
      'Nouveau compteur — clé',
      'Ancien compteur — index HP',
      'Ancien compteur — index HC',
      'Nouveau compteur — index HP',
      'Nouveau compteur — index HC',
      'Câble — section (mm²)',
      'Câble — nature',
      'Câble — longueur (m)',
      'Disjoncteur — conservé',
      'Disjoncteur — voltage',
      'Disjoncteur — marque',
      'Disjoncteur — type',
      'Disjoncteur — mise en service',
      'Disjoncteur — plombage',
      'Client présent',
      'Travaux validés par le client',
      'Satisfaction client (0-4)',
      'Commentaire client',
    ]);
  });

  it('exports the intervention date, the performer and the comment', () => {
    const source = buildSource({
      generalInfo: {
        ...buildSource().report.generalInfo,
        comment: 'Accès par la cour',
      },
    });

    expect(valueOf(source, "Date et heure d'intervention")).toBe(
      '01/10/2026 11:00'
    );
    expect(valueOf(source, 'Réalisé par')).toBe('Jean Tech');
    expect(valueOf(source, 'Commentaire intervention')).toBe(
      'Accès par la cour'
    );
  });

  it('exports the old and new meter keys', () => {
    const source = buildSource();

    expect(valueOf(source, 'Ancien compteur — clé')).toBe('12');
    expect(valueOf(source, 'Nouveau compteur — clé')).toBe('34');
  });

  it('uses Enedis labels for meter types, generations and cable nature', () => {
    const source = buildSource();

    expect(valueOf(source, 'Ancien compteur — type')).toBe('Linky');
    expect(valueOf(source, 'Ancien compteur — génération')).toBe('Linky G1');
    expect(valueOf(source, 'Nouveau compteur — type')).toBe('Linky');
    expect(valueOf(source, 'Nouveau compteur — génération')).toBe('Linky G3');
    expect(valueOf(source, 'Câble — nature')).toBe('Cuivre');
  });

  it('labels a CBE old meter without generation', () => {
    const source = buildSource({
      oldMeter: {
        ...buildSource().report.oldMeter,
        type: 'cbe',
        generation: '',
      },
    });

    expect(valueOf(source, 'Ancien compteur — type')).toBe(
      'CBE (Compteur Bleu Électronique)'
    );
    expect(valueOf(source, 'Ancien compteur — génération')).toBe('');
  });

  it('exports the client work validation only when the client is present', () => {
    const base = buildSource().report.clientValidation;

    expect(valueOf(buildSource(), 'Travaux validés par le client')).toBe('Oui');
    expect(
      valueOf(
        buildSource({ clientValidation: { ...base, present: false } }),
        'Travaux validés par le client'
      )
    ).toBe('');
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

    expect(valueOf(source, 'Nouveau compteur — type')).toBe('');
    expect(valueOf(source, 'Nouveau compteur — matricule')).toBe('');
    expect(valueOf(source, 'Nouveau compteur — clé')).toBe('');
    expect(valueOf(source, 'Ancien compteur — conservé')).toBe('Oui');
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
