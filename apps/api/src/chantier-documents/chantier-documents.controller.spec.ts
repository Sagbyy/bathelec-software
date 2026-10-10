import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChantierDocumentsController } from './chantier-documents.controller';
import { ChantierDocumentsService } from './chantier-documents.service';
import { RoleGuard } from '../role/role.guard';
import { Role, ChantierDocumentType } from '@repo/types';

describe('ChantierDocumentsController', () => {
  let controller: ChantierDocumentsController;

  const mockService = {
    create: jest.fn(),
    findByChantier: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChantierDocumentsController],
      providers: [
        { provide: ChantierDocumentsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ChantierDocumentsController>(
      ChantierDocumentsController
    );
    jest.clearAllMocks();
  });

  describe('access control', () => {
    it('restricts upload to admin and supervisor', () => {
      expect(Reflect.getMetadata('role', controller.create)).toEqual([
        Role.ADMIN,
        Role.SUPERVISOR,
      ]);
      const guards =
        Reflect.getMetadata('__guards__', controller.create) || [];
      expect(guards).toContain(RoleGuard);
    });

    it('restricts delete to admin and supervisor', () => {
      expect(Reflect.getMetadata('role', controller.remove)).toEqual([
        Role.ADMIN,
        Role.SUPERVISOR,
      ]);
      const guards =
        Reflect.getMetadata('__guards__', controller.remove) || [];
      expect(guards).toContain(RoleGuard);
    });

    it('leaves read endpoints open to any authenticated role', () => {
      expect(
        Reflect.getMetadata('role', controller.findByChantier)
      ).toBeUndefined();
      expect(Reflect.getMetadata('role', controller.findOne)).toBeUndefined();
      const listGuards =
        Reflect.getMetadata('__guards__', controller.findByChantier) || [];
      expect(listGuards).not.toContain(RoleGuard);
    });
  });

  describe('create', () => {
    it('delegates to the service with chantier id and uploader id', async () => {
      const dto = {
        name: 'Étude',
        type: ChantierDocumentType.MARKET_STUDY,
        file: 'data:application/pdf;base64,QUJD',
      };
      mockService.create.mockResolvedValue({ id: '1' });

      await controller.create('5', dto, {
        userId: 10,
        username: 'enc',
        role: Role.SUPERVISOR,
      });

      expect(mockService.create).toHaveBeenCalledWith(5, 10, dto);
    });
  });

  describe('findByChantier', () => {
    it('delegates to the service', async () => {
      mockService.findByChantier.mockResolvedValue([]);

      await controller.findByChantier('5');

      expect(mockService.findByChantier).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('throws NotFound when the document does not exist', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('throws NotFound when the document does not exist', async () => {
      mockService.remove.mockResolvedValue(null);

      await expect(controller.remove('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
