import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SpecialHabilitationsService } from './special-habilitations.service';
import { SpecialHabilitation } from './entities/special-habilitation.entity';
import { UsersService } from '../users/users.service';

const mockDoc = {
  userId: 1,
  electricalTitle: true,
  electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
  ss4Title: false,
  ss4TitleDoc: null,
  leadTitle: false,
  leadTitleDoc: null,
  sstCertificate: true,
  sstCertificateDoc: 'data:image/jpeg;base64,sstBase64',
};

const mockModel = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

const mockUsersService = {
  findOneById: jest.fn(),
};

describe('SpecialHabilitationsService', () => {
  let service: SpecialHabilitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialHabilitationsService,
        {
          provide: getModelToken(SpecialHabilitation.name),
          useValue: mockModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<SpecialHabilitationsService>(
      SpecialHabilitationsService
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('retourne le document existant pour un userId', async () => {
      mockModel.findOne.mockResolvedValue(mockDoc);

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockDoc);
      expect(mockModel.findOne).toHaveBeenCalledWith({ userId: 1 });
    });

    it('retourne les valeurs par défaut si aucun document existe', async () => {
      mockModel.findOne.mockResolvedValue(null);

      const result = await service.findByUserId(99);

      expect(result).toMatchObject({
        userId: 99,
        electricalTitle: false,
        electricalTitleDoc: null,
        ss4Title: false,
        ss4TitleDoc: null,
        leadTitle: false,
        leadTitleDoc: null,
        sstCertificate: false,
        sstCertificateDoc: null,
      });
    });
  });

  describe('upsert', () => {
    it('met à jour les habilitations pour un technicien', async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 1,
        role: 'technician',
      });
      const updated = { ...mockDoc, electricalTitle: true };
      mockModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.upsert(1, { electricalTitle: true });

      expect(result).toEqual(updated);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        { $set: { electricalTitle: true } },
        { upsert: true, new: true }
      );
    });

    it("lève ForbiddenException si l'utilisateur est admin", async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 2,
        role: 'admin',
      });

      await expect(
        service.upsert(2, { electricalTitle: true })
      ).rejects.toThrow(ForbiddenException);

      expect(mockModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("lève ForbiddenException si l'utilisateur n'existe pas", async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(
        service.upsert(999, { electricalTitle: true })
      ).rejects.toThrow(ForbiddenException);
    });

    it('met à jour le document SST avec sa pièce jointe', async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 1,
        role: 'technician',
      });
      const updated = {
        ...mockDoc,
        sstCertificate: true,
        sstCertificateDoc: 'data:image/pdf;base64,newSst',
      };
      mockModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.upsert(1, {
        sstCertificate: true,
        sstCertificateDoc: 'data:image/pdf;base64,newSst',
      });

      expect(result.sstCertificate).toBe(true);
      expect(result.sstCertificateDoc).toBe('data:image/pdf;base64,newSst');
    });
  });
});
