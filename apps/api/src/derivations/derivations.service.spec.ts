import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DerivationsService } from './derivations.service';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationStatus } from '../types/derivations-status.enum';

const mockChantier = {
  id: 1,
  address: '3 RUE PAILLET 75005 PARIS',
  enedisAffaireNumber: 'DC21/014312',
  internalAffaireNumber: 'BA570035',
  marketId: 1,
  market: { id: 1, name: 'DR Paris' },
};

const mockDerivation = {
  id: 1,
  userId: 42,
  chantierId: 1,
  status: DerivationStatus.PENDING,
  correctionComment: null,
  createdAt: new Date('2024-01-01'),
  chantier: mockChantier,
};

describe('DerivationsService', () => {
  let service: DerivationsService;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    chantier: { findUnique: jest.fn() },
    derivation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DerivationsService>(DerivationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDerivation', () => {
    const createDto = { userId: 42, chantierId: 1 };

    it('crée une dérivation avec un chantier', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.chantier.findUnique.mockResolvedValue(mockChantier);
      mockPrismaService.derivation.create.mockResolvedValue(mockDerivation);

      const result = await service.createDerivation(createDto);

      expect(result).toEqual(mockDerivation);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
      });
      expect(mockPrismaService.chantier.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith({
        data: {
          userId: 42,
          chantierId: 1,
          correctionComment: null,
          status: DerivationStatus.PENDING,
        },
        include: { chantier: { include: { market: true } } },
      });
    });

    it('crée une dérivation sans chantier (chantierId null)', async () => {
      const dto = { userId: 42 };
      const derivationSansChantier = { ...mockDerivation, chantierId: null, chantier: null };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.derivation.create.mockResolvedValue(derivationSansChantier);

      const result = await service.createDerivation(dto);

      expect(result).toEqual(derivationSansChantier);
      expect(mockPrismaService.chantier.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith({
        data: {
          userId: 42,
          chantierId: null,
          correctionComment: null,
          status: DerivationStatus.PENDING,
        },
        include: { chantier: { include: { market: true } } },
      });
    });

    it("lève NotFoundException si l'utilisateur n'existe pas", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createDerivation(createDto)).rejects.toThrow(
        'User not found'
      );
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });

    it("lève NotFoundException si le chantier n'existe pas", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.chantier.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createDerivation(createDto)).rejects.toThrow(
        'Chantier not found'
      );
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });
  });

  describe('findDerivationByUserId', () => {
    it('retourne les dérivations pour un utilisateur', async () => {
      mockPrismaService.derivation.findMany.mockResolvedValue([mockDerivation]);

      const result = await service.findDerivationByUserId(42);

      expect(result).toEqual([mockDerivation]);
      expect(mockPrismaService.derivation.findMany).toHaveBeenCalledWith({
        where: { userId: 42 },
        include: { chantier: { include: { market: true } } },
      });
    });

    it('retourne un tableau vide si aucune dérivation', async () => {
      mockPrismaService.derivation.findMany.mockResolvedValue([]);

      const result = await service.findDerivationByUserId(42);

      expect(result).toEqual([]);
    });
  });

  describe('findDerivationById', () => {
    it('retourne une dérivation par id avec son chantier', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);

      const result = await service.findDerivationById(1);

      expect(result).toEqual(mockDerivation);
      expect(mockPrismaService.derivation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { chantier: { include: { market: true } } },
      });
    });

    it("lève NotFoundException si la dérivation n'existe pas", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(null);

      await expect(service.findDerivationById(999)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findDerivationById(999)).rejects.toThrow(
        'Derivation not found'
      );
    });
  });

  describe('findAllDerivations', () => {
    it('retourne toutes les dérivations avec leur chantier et marché', async () => {
      mockPrismaService.derivation.findMany.mockResolvedValue([mockDerivation]);

      const result = await service.findAllDerivations();

      expect(result).toEqual([mockDerivation]);
      expect(mockPrismaService.derivation.findMany).toHaveBeenCalledWith({
        include: { chantier: { include: { market: true } } },
      });
    });
  });

  describe('updateDerivation', () => {
    it("met à jour le commentaire de correction d'une dérivation", async () => {
      const updated = { ...mockDerivation, correctionComment: 'Revoir section 3' };
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.derivation.update.mockResolvedValue(updated);

      const result = await service.updateDerivation(1, {
        correctionComment: 'Revoir section 3',
      });

      expect(result).toEqual(updated);
      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { correctionComment: 'Revoir section 3' },
        include: { chantier: { include: { market: true } } },
      });
    });

    it("lève NotFoundException si la dérivation n'existe pas", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(null);

      await expect(
        service.updateDerivation(999, { correctionComment: 'Revoir' })
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });
  });
});
