import { Test, TestingModule } from '@nestjs/testing';
import { DerivationsController } from './derivations.controller';
import { DerivationsService } from './derivations.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
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

const mockDerivationsService = {
  createDerivation: jest.fn(),
  findDerivationByUserId: jest.fn(),
  findDerivationById: jest.fn(),
  findAllDerivations: jest.fn(),
  updateDerivation: jest.fn(),
};

describe('DerivationsController', () => {
  let controller: DerivationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerivationsController],
      providers: [
        { provide: DerivationsService, useValue: mockDerivationsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DerivationsController>(DerivationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDerivation', () => {
    it('crée une dérivation avec chantierId', async () => {
      mockDerivationsService.createDerivation.mockResolvedValue(mockDerivation);
      const dto = { userId: 42, chantierId: 1 };

      const result = await controller.createDerivation(dto);

      expect(result).toEqual(mockDerivation);
      expect(mockDerivationsService.createDerivation).toHaveBeenCalledWith(dto);
    });
  });

  describe('findDerivationByUserId', () => {
    it('retourne les dérivations par userId', async () => {
      mockDerivationsService.findDerivationByUserId.mockResolvedValue([
        mockDerivation,
      ]);

      const result = await controller.findDerivationByUserId(42);

      expect(result).toEqual([mockDerivation]);
      expect(
        mockDerivationsService.findDerivationByUserId
      ).toHaveBeenCalledWith(42);
    });
  });

  describe('findDerivationById', () => {
    it('retourne une dérivation par id avec son chantier et marché', async () => {
      mockDerivationsService.findDerivationById.mockResolvedValue(
        mockDerivation
      );

      const result = await controller.findDerivationById(1);

      expect(result).toEqual(mockDerivation);
      expect(mockDerivationsService.findDerivationById).toHaveBeenCalledWith(1);
    });
  });

  describe('findAllDerivations', () => {
    it('retourne toutes les dérivations', async () => {
      mockDerivationsService.findAllDerivations.mockResolvedValue([
        mockDerivation,
      ]);

      const result = await controller.findAllDerivations();

      expect(result).toEqual([mockDerivation]);
      expect(mockDerivationsService.findAllDerivations).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('updateDerivation', () => {
    it("met à jour le commentaire de correction d'une dérivation", async () => {
      const updated = { ...mockDerivation, correctionComment: 'Revoir section 3' };
      mockDerivationsService.updateDerivation.mockResolvedValue(updated);

      const result = await controller.updateDerivation(1, {
        correctionComment: 'Revoir section 3',
      });

      expect(result).toEqual(updated);
      expect(mockDerivationsService.updateDerivation).toHaveBeenCalledWith(1, {
        correctionComment: 'Revoir section 3',
      });
    });
  });
});
