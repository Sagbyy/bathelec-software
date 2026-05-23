import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChantiersService } from './chantiers.service';
import { PrismaService } from '../prisma/prisma.service';

const mockMarket = {
  id: 1,
  name: 'DR Paris',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockChantier = {
  id: 1,
  address: '3 RUE PAILLET 75005 PARIS',
  enedisAffaireNumber: 'DC21/014312',
  internalAffaireNumber: 'BA570035',
  marketId: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  market: mockMarket,
};

const createDto = {
  address: '3 RUE PAILLET 75005 PARIS',
  enedisAffaireNumber: 'DC21/014312',
  internalAffaireNumber: 'BA570035',
  marketId: 1,
};

describe('ChantiersService', () => {
  let service: ChantiersService;

  const mockPrismaService = {
    market: {
      findUnique: jest.fn(),
    },
    chantier: {
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
        ChantiersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ChantiersService>(ChantiersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crée un chantier quand le marché existe', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(mockMarket);
      mockPrismaService.chantier.create.mockResolvedValue(mockChantier);

      const result = await service.create(createDto);

      expect(result).toEqual(mockChantier);
      expect(mockPrismaService.market.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.chantier.create).toHaveBeenCalledWith({
        data: createDto,
        include: { market: true },
      });
    });

    it("lève NotFoundException si le marché n'existe pas", async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createDto)).rejects.toThrow('Market not found');
      expect(mockPrismaService.chantier.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('retourne tous les chantiers avec leur marché', async () => {
      mockPrismaService.chantier.findMany.mockResolvedValue([mockChantier]);

      const result = await service.findAll();

      expect(result).toEqual([mockChantier]);
      expect(mockPrismaService.chantier.findMany).toHaveBeenCalledWith({
        include: { market: true },
      });
    });

    it('retourne un tableau vide si aucun chantier', async () => {
      mockPrismaService.chantier.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('retourne un chantier par id avec son marché', async () => {
      mockPrismaService.chantier.findUnique.mockResolvedValue(mockChantier);

      const result = await service.findOne(1);

      expect(result).toEqual(mockChantier);
      expect(mockPrismaService.chantier.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { market: true },
      });
    });

    it("lève NotFoundException si le chantier n'existe pas", async () => {
      mockPrismaService.chantier.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Chantier not found');
    });
  });

  describe('update', () => {
    it('met à jour un chantier existant', async () => {
      const updated = {
        ...mockChantier,
        address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      };
      mockPrismaService.chantier.findUnique.mockResolvedValue(mockChantier);
      mockPrismaService.chantier.update.mockResolvedValue(updated);

      const result = await service.update(1, {
        address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      });

      expect(result).toEqual(updated);
      expect(mockPrismaService.chantier.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS' },
        include: { market: true },
      });
    });

    it("lève NotFoundException si le chantier n'existe pas", async () => {
      mockPrismaService.chantier.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { address: 'Nouvelle adresse' })).rejects.toThrow(
        NotFoundException
      );
      expect(mockPrismaService.chantier.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('supprime un chantier existant', async () => {
      mockPrismaService.chantier.findUnique.mockResolvedValue(mockChantier);
      mockPrismaService.chantier.delete.mockResolvedValue(mockChantier);

      const result = await service.remove(1);

      expect(result).toEqual(mockChantier);
      expect(mockPrismaService.chantier.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("lève NotFoundException si le chantier n'existe pas", async () => {
      mockPrismaService.chantier.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.chantier.delete).not.toHaveBeenCalled();
    });
  });
});
