import { Test, TestingModule } from '@nestjs/testing';
import { OfficialDocumentsController } from './official-documents.controller';
import { OfficialDocumentsService } from './official-documents.service';
import { SelfAdminOrSupervisorGuard } from '../common/guards/self-admin-or-supervisor.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

const officialDocumentEntity = {
  userId: 1,
  idCard: 'data:image/jpeg;base64,idCardBase64',
  btpCard: 'data:image/jpeg;base64,btpCardBase64',
  mutualCard: 'data:image/jpeg;base64,mutualCardBase64',
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
      .overrideGuard(SelfAdminOrSupervisorGuard)
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
        idCard: 'data:image/jpeg;base64,idCardBase64',
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
      const dto = { mutualCard: 'data:image/jpeg;base64,nouvelleMutuelle' };
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

  describe('protection IDOR via SelfAdminOrSupervisorGuard', () => {
    it.each(['findByUserId', 'update', 'remove'] as const)(
      'applique SelfAdminOrSupervisorGuard sur %s (ouvert aux encadrants)',
      (method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          OfficialDocumentsController.prototype[method]
        );
        expect(guards).toContain(SelfAdminOrSupervisorGuard);
      }
    );

    it("n'applique pas de guard self/role sur createOrUpdate (userId vient du JWT)", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          OfficialDocumentsController.prototype.createOrUpdate
        ) ?? [];
      expect(guards).not.toContain(SelfAdminOrSupervisorGuard);
    });
  });
});
