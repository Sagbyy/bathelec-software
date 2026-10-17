import { Test, TestingModule } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { Role as UserRole } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { ROLE_METADATA_KEY } from '../role/role.decorator';
import {
  DerivationExportsController,
  XLSX_MIME_TYPE,
} from './derivation-exports.controller';
import { DerivationExportsService } from './derivation-exports.service';

describe('DerivationExportsController', () => {
  let controller: DerivationExportsController;
  const exportsService = {
    exportDerivation: jest.fn(),
    exportChantier: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerivationExportsController],
      providers: [
        { provide: DerivationExportsService, useValue: exportsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(DerivationExportsController);
  });

  it('returns the derivation export as an xlsx download', async () => {
    exportsService.exportDerivation.mockResolvedValue({
      fileName: 'export-enedis-derivation-7.xlsx',
      buffer: Buffer.from('xlsx'),
    });

    const file = await controller.exportDerivation(7);

    expect(file).toBeInstanceOf(StreamableFile);
    expect(file.getHeaders()).toMatchObject({
      type: XLSX_MIME_TYPE,
      disposition: 'attachment; filename="export-enedis-derivation-7.xlsx"',
    });
    expect(exportsService.exportDerivation).toHaveBeenCalledWith(7);
  });

  it('returns the chantier export as an xlsx download', async () => {
    exportsService.exportChantier.mockResolvedValue({
      fileName: 'export-enedis-chantier-5.xlsx',
      buffer: Buffer.from('xlsx'),
    });

    const file = await controller.exportChantier(5);

    expect(file.getHeaders().disposition).toBe(
      'attachment; filename="export-enedis-chantier-5.xlsx"'
    );
  });

  it('restricts exports to admins and supervisors', () => {
    expect(
      Reflect.getMetadata(ROLE_METADATA_KEY, DerivationExportsController)
    ).toEqual([UserRole.ADMIN, UserRole.SUPERVISOR]);
    expect(
      Reflect.getMetadata('__guards__', DerivationExportsController)
    ).toEqual([JwtAuthGuard, RoleGuard]);
  });
});
