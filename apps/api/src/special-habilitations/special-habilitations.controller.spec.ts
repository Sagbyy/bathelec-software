import { Test, TestingModule } from '@nestjs/testing';
import { SpecialHabilitationsController } from './special-habilitations.controller';
import { SpecialHabilitationsService } from './special-habilitations.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { SelfOrAdminGuard } from '../common/guards/self-or-admin.guard';
import { RoleGuard } from '../role/role.guard';

const mockDoc = {
  userId: 1,
  electricalTitle: true,
  electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
  ss4Title: false,
  ss4TitleDoc: null,
  leadTitle: false,
  leadTitleDoc: null,
  sstCertificate: false,
  sstCertificateDoc: null,
};

const mockService = {
  findByUserId: jest.fn().mockResolvedValue(mockDoc),
  upsert: jest.fn().mockResolvedValue(mockDoc),
};

describe('SpecialHabilitationsController', () => {
  let controller: SpecialHabilitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialHabilitationsController],
      providers: [
        {
          provide: SpecialHabilitationsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SelfOrAdminGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SpecialHabilitationsController>(
      SpecialHabilitationsController
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUserId', () => {
    it('retourne les habilitations spéciales pour un userId', async () => {
      mockService.findByUserId.mockResolvedValue(mockDoc);

      const result = await controller.findByUserId('1');

      expect(result).toEqual(mockDoc);
      expect(mockService.findByUserId).toHaveBeenCalledWith(1);
    });

    it('convertit le paramètre userId string en number', async () => {
      await controller.findByUserId('42');
      expect(mockService.findByUserId).toHaveBeenCalledWith(42);
    });
  });

  describe('upsert', () => {
    it('met à jour les habilitations et retourne le document', async () => {
      const dto = { electricalTitle: true };
      const updated = { ...mockDoc, ...dto };
      mockService.upsert.mockResolvedValue(updated);

      const result = await controller.upsert('1', dto);

      expect(result).toEqual(updated);
      expect(mockService.upsert).toHaveBeenCalledWith(1, dto);
    });

    it('convertit le paramètre userId string en number', async () => {
      await controller.upsert('5', { ss4Title: true });
      expect(mockService.upsert).toHaveBeenCalledWith(5, { ss4Title: true });
    });
  });

  describe('guards appliqués', () => {
    it('applique SelfOrAdminGuard sur findByUserId', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        SpecialHabilitationsController.prototype.findByUserId
      );
      expect(guards).toContain(SelfOrAdminGuard);
    });

    it('applique RoleGuard sur upsert', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        SpecialHabilitationsController.prototype.upsert
      );
      expect(guards).toContain(RoleGuard);
    });
  });
});
