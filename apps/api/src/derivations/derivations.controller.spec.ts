import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata } from '@nestjs/common';
import {
  DerivationsController,
  STRICT_VALIDATION,
} from './derivations.controller';
import { UpdateDerivationDto } from './dto/request/update-derivation.dto';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationsService } from './derivations.service';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/types';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ROLE_METADATA_KEY } from '../role/role.decorator';
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
  findMyDerivations: jest.fn(),
  assignTeam: jest.fn(),
  assignUser: jest.fn(),
  claimDerivation: jest.fn(),
  getReviewStats: jest.fn(),
};

const currentUser = { userId: 42, username: 'tech', role: Role.TECHNICIAN };

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
      const dto = { teamId: 3, userId: 42, chantierId: 1 };

      const result = await controller.createDerivation(dto, currentUser);

      expect(result).toEqual(mockDerivation);
      expect(mockDerivationsService.createDerivation).toHaveBeenCalledWith(
        dto,
        currentUser
      );
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
      const updated = {
        ...mockDerivation,
        correctionComment: 'Revoir section 3',
      };
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

  describe('assignment endpoints', () => {
    it('retourne les dérivations de l’utilisateur courant', async () => {
      mockDerivationsService.findMyDerivations.mockResolvedValue([
        mockDerivation,
      ]);

      const result = await controller.findMyDerivations(currentUser);

      expect(result).toEqual([mockDerivation]);
      expect(mockDerivationsService.findMyDerivations).toHaveBeenCalledWith(
        currentUser
      );
    });

    it('délègue l’affectation à une équipe', async () => {
      await controller.assignTeam(1, { teamId: 3 });

      expect(mockDerivationsService.assignTeam).toHaveBeenCalledWith(1, 3);
    });

    it('délègue l’attribution à un technicien avec l’acteur courant', async () => {
      await controller.assignUser(1, { userId: 42 }, currentUser);

      expect(mockDerivationsService.assignUser).toHaveBeenCalledWith(
        1,
        42,
        currentUser
      );
    });

    it('délègue l’auto-attribution avec l’acteur courant', async () => {
      await controller.claimDerivation(1, currentUser);

      expect(mockDerivationsService.claimDerivation).toHaveBeenCalledWith(
        1,
        currentUser
      );
    });

    it.each([
      ['assignTeam', [Role.ADMIN, Role.SUPERVISOR]],
      ['assignUser', [Role.ADMIN, Role.SUPERVISOR, Role.SITE_MANAGER]],
      ['claimDerivation', [Role.TECHNICIAN, Role.SITE_MANAGER]],
      ['findMyDerivations', [Role.TECHNICIAN, Role.SITE_MANAGER]],
      ['getReviewStats', [Role.ADMIN, Role.SUPERVISOR]],
      [
        'createDerivation',
        [Role.ADMIN, Role.SUPERVISOR, Role.SITE_MANAGER, Role.TECHNICIAN],
      ],
    ] as const)('restreint %s aux rôles %j', (handler, roles) => {
      const allowed = new Reflector().get(
        ROLE_METADATA_KEY,
        DerivationsController.prototype[handler]
      );

      expect(allowed).toEqual(roles);
    });
  });

  describe('body validation', () => {
    const asBody = (metatype: ArgumentMetadata['metatype']) =>
      ({ type: 'body', metatype }) as ArgumentMetadata;

    it('accepte le commentaire et le statut sur la mise à jour', async () => {
      const body = { correctionComment: 'Revoir', status: 'Revising' };

      await expect(
        STRICT_VALIDATION.transform(body, asBody(UpdateDerivationDto))
      ).resolves.toEqual(body);
    });

    it.each([
      [{ userId: 7 }],
      [{ teamId: 3 }],
      [{ user: { connect: { id: 7 } } }],
    ])(
      "rejette les champs d'attribution sur la mise à jour : %j",
      async (body) => {
        await expect(
          STRICT_VALIDATION.transform(body, asBody(UpdateDerivationDto))
        ).rejects.toThrow();
      }
    );

    it('exige une équipe à la création', async () => {
      await expect(
        STRICT_VALIDATION.transform(
          { chantierId: 1 },
          asBody(CreateDerivationDto)
        )
      ).rejects.toThrow();
    });
  });
});
