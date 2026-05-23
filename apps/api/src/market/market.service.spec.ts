import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MarketService } from './market.service';
import { PrismaService } from '../prisma/prisma.service';

const mockMarket = {
  id: 1,
  name: 'DR Paris',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  chantiers: [],
};

describe('MarketService', () => {
  let service: MarketService;

  const mockPrismaService = {
    market: {
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
        MarketService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MarketService>(MarketService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crée un marché', async () => {
      mockPrismaService.market.create.mockResolvedValue(mockMarket);

      const result = await service.create({ name: 'DR Paris' });

      expect(result).toEqual(mockMarket);
      expect(mockPrismaService.market.create).toHaveBeenCalledWith({
        data: { name: 'DR Paris' },
      });
    });
  });

  describe('findAll', () => {
    it('retourne tous les marchés avec leurs chantiers', async () => {
      mockPrismaService.market.findMany.mockResolvedValue([mockMarket]);

      const result = await service.findAll();

      expect(result).toEqual([mockMarket]);
      expect(mockPrismaService.market.findMany).toHaveBeenCalledWith({
        include: { chantiers: true },
      });
    });

    it('retourne un tableau vide si aucun marché', async () => {
      mockPrismaService.market.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('retourne un marché par id avec ses chantiers', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(mockMarket);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMarket);
      expect(mockPrismaService.market.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { chantiers: true },
      });
    });

    it("lève NotFoundException si le marché n'existe pas", async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Market not found');
    });
  });

  describe('update', () => {
    it('met à jour un marché existant', async () => {
      const updated = { ...mockMarket, name: 'DR Île-de-France' };
      mockPrismaService.market.findUnique.mockResolvedValue(mockMarket);
      mockPrismaService.market.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'DR Île-de-France' });

      expect(result).toEqual(updated);
      expect(mockPrismaService.market.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'DR Île-de-France' },
      });
    });

    it("lève NotFoundException si le marché n'existe pas", async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Inconnu' })).rejects.toThrow(
        NotFoundException
      );
      expect(mockPrismaService.market.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('supprime un marché existant', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(mockMarket);
      mockPrismaService.market.delete.mockResolvedValue(mockMarket);

      const result = await service.remove(1);

      expect(result).toEqual(mockMarket);
      expect(mockPrismaService.market.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("lève NotFoundException si le marché n'existe pas", async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.market.delete).not.toHaveBeenCalled();
    });
  });
});
