import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OfficialDocumentsController } from './official-documents.controller';
import { OfficialDocumentsService } from './official-documents.service';
import { SelfOrAdminGuard } from '../common/guards/self-or-admin.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

const officialDocumentEntity = {
  userId: 1,
  pieceIdentite: 'data:image/jpeg;base64,pieceIdentiteBase64',
  carteProBtp: 'data:image/jpeg;base64,carteProBtpBase64',
  carteMutuelle: 'data:image/jpeg;base64,carteMutuelleBase64',
};

const mockOfficialDocumentsService = {
  createOrUpdate: jest.fn().mockResolvedValue(officialDocumentEntity),
  findByUserId: jest.fn().mockResolvedValue(officialDocumentEntity),
  update: jest.fn().mockResolvedValue(officialDocumentEntity),
  remove: jest.fn().mockResolvedValue(officialDocumentEntity),
};

describe('OfficialDocumentsController', () => {
  let controller: OfficialDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficialDocumentsController],
      providers: [
        {
          provide: OfficialDocumentsService,
          useValue: mockOfficialDocumentsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SelfOrAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OfficialDocumentsController>(
      OfficialDocumentsController
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('utilise le userId du JWT, pas du body', async () => {
      const dto = {
        pieceIdentite: 'data:image/jpeg;base64,pieceIdentiteBase64',
      };
      mockOfficialDocumentsService.createOrUpdate.mockResolvedValue(
        officialDocumentEntity
      );

      const result = await controller.createOrUpdate(
        { userId: 1, username: 'tech', role: 'technician' },
        dto
      );

      expect(result).toEqual(officialDocumentEntity);
      expect(mockOfficialDocumentsService.createOrUpdate).toHaveBeenCalledWith(
        1,
        dto
      );
    });
  });

  describe('findByUserId', () => {
    it('retourne les documents pour un userId', async () => {
      mockOfficialDocumentsService.findByUserId.mockResolvedValue(
        officialDocumentEntity
      );

      const result = await controller.findByUserId('1');

      expect(result).toEqual(officialDocumentEntity);
      expect(mockOfficialDocumentsService.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('met à jour les documents par userId', async () => {
      const dto = { carteMutuelle: 'data:image/jpeg;base64,nouvelleMutuelle' };
      const updated = { ...officialDocumentEntity, ...dto };
      mockOfficialDocumentsService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);

      expect(result).toEqual(updated);
      expect(mockOfficialDocumentsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('supprime les documents par userId', async () => {
      mockOfficialDocumentsService.remove.mockResolvedValue(
        officialDocumentEntity
      );

      const result = await controller.remove('1');

      expect(result).toEqual(officialDocumentEntity);
      expect(mockOfficialDocumentsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('protection IDOR via SelfOrAdminGuard', () => {
    it('applique SelfOrAdminGuard sur findByUserId', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OfficialDocumentsController.prototype.findByUserId
      );
      expect(guards).toContain(SelfOrAdminGuard);
    });

    it('applique SelfOrAdminGuard sur update', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OfficialDocumentsController.prototype.update
      );
      expect(guards).toContain(SelfOrAdminGuard);
    });

    it('applique SelfOrAdminGuard sur remove', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OfficialDocumentsController.prototype.remove
      );
      expect(guards).toContain(SelfOrAdminGuard);
    });

    it('n\'applique pas SelfOrAdminGuard sur createOrUpdate (userId vient du JWT)', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        OfficialDocumentsController.prototype.createOrUpdate
      ) ?? [];
      expect(guards).not.toContain(SelfOrAdminGuard);
    });
  });
});
