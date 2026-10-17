import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Workbook } from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { CompletedDerivation } from '../completed-derivation/entities/completed-derivations.entity';
import { DerivationExportsService } from './derivation-exports.service';
import { buildSource } from './lib/enedis-export.fixtures';

const PNG_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

describe('DerivationExportsService', () => {
  let service: DerivationExportsService;

  const prisma = { derivation: { findMany: jest.fn() } };
  const model = { find: jest.fn() };

  const givenReports = (reports: unknown[]) =>
    model.find.mockReturnValue({ lean: () => Promise.resolve(reports) });

  const readSheet = async (buffer: Buffer) => {
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    return workbook.getWorksheet('Export Enedis')!;
  };

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
      expect.objectContaining({ where: { id: 7 } })
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
      expect.objectContaining({ where: { chantierId: 5 } })
    );
    expect(sheet.rowCount).toBe(3);
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
