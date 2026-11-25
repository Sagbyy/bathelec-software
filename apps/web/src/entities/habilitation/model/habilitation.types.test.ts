import { describe, it, expect } from 'vitest';
import {
  DEFAULT_HABILITATIONS,
  HABILITATION_TABLE,
  TableCell,
} from './habilitation.types';

const SPEC_CODE_LABELS = [
  'B0',
  'BS',
  'BE',
  'H0',
  'H0V',
  'B1',
  'B1V',
  'H1',
  'H1V',
  'B2',
  'B2V',
  'B2V essais',
  'H2',
  'H2V',
  'H2V essais',
  'BC',
  'HC',
  'BR',
  'BE + attribut',
  'HE + attribut',
];

const matrixCells = HABILITATION_TABLE.rows
  .flatMap((row) => row.cells)
  .filter((cell): cell is TableCell => cell !== null);

const matrixCodes = matrixCells.flatMap((cell) => cell.codes);
const matrixLabels = matrixCells.flatMap((cell) => cell.labels);

describe('HABILITATION_TABLE', () => {
  it('lists every habilitation code only once', () => {
    expect(new Set(matrixCodes).size).toBe(matrixCodes.length);
    expect(new Set(matrixLabels).size).toBe(matrixLabels.length);
  });

  it('covers exactly the 20 NF C 18-510 codes of the specification', () => {
    expect(matrixCodes).toHaveLength(20);
    expect([...matrixLabels].sort()).toEqual([...SPEC_CODE_LABELS].sort());
  });

  it('matches the habilitation keys stored per technician', () => {
    expect([...matrixCodes].sort()).toEqual(
      Object.keys(DEFAULT_HABILITATIONS).sort()
    );
  });

  it('pairs each code with exactly one label', () => {
    matrixCells.forEach((cell) => {
      expect(cell.labels).toHaveLength(cell.codes.length);
    });
  });
});
