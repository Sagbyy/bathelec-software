import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';

const mockMarket = {
  id: 1,
  name: 'DR Paris',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  chantiers: [],
};

const mockMarketService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('MarketController', () => {
  let controller: MarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [{ provide: MarketService, useValue: mockMarketService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MarketController>(MarketController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('crée un marché', async () => {
      mockMarketService.create.mockResolvedValue(mockMarket);

      const result = await controller.create({ name: 'DR Paris' });

      expect(result).toEqual(mockMarket);
      expect(mockMarketService.create).toHaveBeenCalledWith({ name: 'DR Paris' });
    });
  });

  describe('findAll', () => {
    it('retourne tous les marchés', async () => {
      mockMarketService.findAll.mockResolvedValue([mockMarket]);

      const result = await controller.findAll();

      expect(result).toEqual([mockMarket]);
      expect(mockMarketService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('retourne un marché par id (param string → number)', async () => {
      mockMarketService.findOne.mockResolvedValue(mockMarket);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockMarket);
      expect(mockMarketService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('met à jour un marché', async () => {
      const updated = { ...mockMarket, name: 'DR IDF' };
      mockMarketService.update.mockResolvedValue(updated);

      const result = await controller.update('1', { name: 'DR IDF' });

      expect(result).toEqual(updated);
      expect(mockMarketService.update).toHaveBeenCalledWith(1, {
        name: 'DR IDF',
      });
    });
  });

  describe('remove', () => {
    it('supprime un marché', async () => {
      mockMarketService.remove.mockResolvedValue(mockMarket);

      const result = await controller.remove('1');

      expect(result).toEqual(mockMarket);
      expect(mockMarketService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('protection des routes admin via RoleGuard', () => {
    it('applique RoleGuard sur create', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        MarketController.prototype.create
      );
      expect(guards).toContain(RoleGuard);
    });

    it('applique RoleGuard sur update', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        MarketController.prototype.update
      );
      expect(guards).toContain(RoleGuard);
    });

    it('applique RoleGuard sur remove', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        MarketController.prototype.remove
      );
      expect(guards).toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findAll", () => {
      const guards =
        Reflect.getMetadata('__guards__', MarketController.prototype.findAll) ??
        [];
      expect(guards).not.toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findOne", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          MarketController.prototype.findOne
        ) ?? [];
      expect(guards).not.toContain(RoleGuard);
    });
  });
});
