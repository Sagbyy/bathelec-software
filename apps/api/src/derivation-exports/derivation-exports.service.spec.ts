import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Workbook, Worksheet } from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationStatus } from '../types/derivations-status.enum';
import { CompletedDerivation } from '../completed-derivation/entities/completed-derivations.entity';
import { DerivationExportsService } from './derivation-exports.service';
import { buildSource } from './lib/enedis-export.fixtures';
import { ENEDIS_COLUMNS } from './lib/enedis-export.columns';

const PNG_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

describe('DerivationExportsService', () => {
  let service: DerivationExportsService;

  const prisma = {
    derivation: { findMany: jest.fn() },
    user: { findMany: jest.fn() },
  };
  const model = { find: jest.fn() };

  const givenReports = (reports: unknown[]) =>
    model.find.mockReturnValue({ lean: () => Promise.resolve(reports) });

  const readSheet = async (buffer: Buffer) => {
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    return workbook.getWorksheet('Export Enedis')!;
  };

  const cellUnder = (sheet: Worksheet, header: string) =>
    sheet
      .getRow(2)
      .getCell(
        ENEDIS_COLUMNS.findIndex((column) => column.header === header) + 1
      ).value;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivationExportsService,
        { provide: PrismaService, useValue: prisma },
        { provide: getModelToken(CompletedDerivation.name), useValue: model },
      ],
    }).compile();
    service = module.get(DerivationExportsService);
  });

  it('exports one derivation as an Excel sheet', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier }]);
    givenReports([{ ...report, requestedDerivationId: 7 }]);

    const file = await service.exportDerivation(7);
    const sheet = await readSheet(file.buffer);

    expect(file.fileName).toBe('export-enedis-derivation-7.xlsx');
    expect(prisma.derivation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7, status: DerivationStatus.COMPLETED },
      })
    );
    expect(sheet.getRow(1).getCell(1).value).toBe("N° d'affaire Enedis");
    expect(sheet.getRow(2).getCell(3).value).toBe(
      'SGX001 - COM001 - ASC001 - 001 - 101'
    );
    expect(sheet.rowCount).toBe(2);
  });

  it('embeds the technician signature as an image', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier }]);
    givenReports([
      {
        ...report,
        requestedDerivationId: 7,
        clientValidation: {
          ...report.clientValidation,
          technicianSignature: PNG_PIXEL,
        },
      },
    ]);

    const sheet = await readSheet((await service.exportDerivation(7)).buffer);

    expect(sheet.getImages()).toHaveLength(1);
  });

  it('exports every completed derivation of a chantier, skipping those without report', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([
      { id: 1, chantier },
      { id: 2, chantier },
      { id: 3, chantier },
    ]);
    givenReports([
      { ...report, requestedDerivationId: 1 },
      { ...report, requestedDerivationId: 3 },
    ]);

    const file = await service.exportChantier(5);
    const sheet = await readSheet(file.buffer);

    expect(file.fileName).toBe('export-enedis-chantier-5.xlsx');
    expect(prisma.derivation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { chantierId: 5, status: DerivationStatus.COMPLETED },
      })
    );
    expect(sheet.rowCount).toBe(3);
  });

  it('only exports derivations validated by an admin', async () => {
    prisma.derivation.findMany.mockResolvedValue([]);
    givenReports([]);

    await expect(service.exportDerivation(7)).rejects.toThrow(
      NotFoundException
    );
    expect(model.find).toHaveBeenCalledWith({
      requestedDerivationId: { $in: [] },
    });
  });

  it('resolves the performer user id to the technician name', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier }]);
    prisma.user.findMany.mockResolvedValue([
      { id: 42, firstName: 'Paul', lastName: 'Martin' },
    ]);
    givenReports([
      {
        ...report,
        requestedDerivationId: 7,
        generalInfo: { ...report.generalInfo, derivationBy: '42' },
      },
    ]);

    const sheet = await readSheet((await service.exportDerivation(7)).buffer);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: [42] } } })
    );
    expect(cellUnder(sheet, 'Réalisé par')).toBe('Paul Martin');
  });

  it('keeps a free-text performer when it is not a user id', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier }]);
    givenReports([{ ...report, requestedDerivationId: 7 }]);

    const sheet = await readSheet((await service.exportDerivation(7)).buffer);

    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(cellUnder(sheet, 'Réalisé par')).toBe('Jean Tech');
  });

  it('keeps the raw performer id when the user no longer exists', async () => {
    const { chantier, report } = buildSource();
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier }]);
    prisma.user.findMany.mockResolvedValue([]);
    givenReports([
      {
        ...report,
        requestedDerivationId: 7,
        generalInfo: { ...report.generalInfo, derivationBy: '99' },
      },
    ]);

    const sheet = await readSheet((await service.exportDerivation(7)).buffer);

    expect(cellUnder(sheet, 'Réalisé par')).toBe('99');
  });

  it('refuses to export a derivation without completed report', async () => {
    prisma.derivation.findMany.mockResolvedValue([{ id: 7, chantier: null }]);
    givenReports([]);

    await expect(service.exportDerivation(7)).rejects.toThrow(
      NotFoundException
    );
  });

  it('refuses to export a chantier without completed report', async () => {
    prisma.derivation.findMany.mockResolvedValue([]);
    givenReports([]);

    await expect(service.exportChantier(5)).rejects.toThrow(NotFoundException);
  });
});
