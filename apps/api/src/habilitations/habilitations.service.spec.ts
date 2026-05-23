import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HabilitationsService } from './habilitations.service';
import { Habilitation } from './entities/habilitation.entity';
import { UsersService } from '../users/users.service';

const mockDoc = {
  userId: 1,
  b0: true,
  bs: false,
  be: false,
  h0: false,
  h0v: false,
  b1: false,
  b1v: false,
  h1: false,
  h1v: false,
  b2: false,
  b2v: false,
  b2vEssais: false,
  h2: false,
  h2v: false,
  h2vEssais: false,
  bc: false,
  hc: false,
  br: false,
  beAttribut: false,
  heAttribut: false,
};

const mockModel = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

const mockUsersService = {
  findOneById: jest.fn(),
};

describe('HabilitationsService', () => {
  let service: HabilitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabilitationsService,
        {
          provide: getModelToken(Habilitation.name),
          useValue: mockModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<HabilitationsService>(HabilitationsService);
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

      expect(result).toMatchObject({ userId: 99, b0: false, bc: false });
    });
  });

  describe('upsert', () => {
    it('met à jour les habilitations pour un technicien', async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 1,
        role: 'technician',
      });
      const updated = { ...mockDoc, b0: true, bs: true };
      mockModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.upsert(1, { b0: true, bs: true });

      expect(result).toEqual(updated);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        { $set: { b0: true, bs: true } },
        { upsert: true, new: true }
      );
    });

    it("lève ForbiddenException si l'utilisateur est admin", async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 2,
        role: 'admin',
      });

      await expect(service.upsert(2, { b0: true })).rejects.toThrow(
        ForbiddenException
      );

      expect(mockModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("lève ForbiddenException si l'utilisateur n'existe pas", async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(service.upsert(999, { b0: true })).rejects.toThrow(
        ForbiddenException
      );
    });

    it("le message d'erreur précise qu'il faut être technicien", async () => {
      mockUsersService.findOneById.mockResolvedValue({
        id: 2,
        role: 'admin',
      });

      await expect(service.upsert(2, { b0: true })).rejects.toThrow(
        "Les habilitations ne peuvent être assignées qu'à un technicien."
      );
    });
  });
});
