import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@repo/types';
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

const DERIVATION_INCLUDE = {
  chantier: { include: { market: true } },
  team: { select: { id: true, name: true } },
  user: { select: { id: true, firstName: true, lastName: true } },
};

const admin = { userId: 1, username: 'admin', role: Role.ADMIN };

const technician = { userId: 42, username: 'tech', role: Role.TECHNICIAN };
const siteManager = { userId: 7, username: 'lead', role: Role.SITE_MANAGER };

const mockDerivation = {
  id: 1,
  userId: 42,
  teamId: 3,
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
    siteTeam: { findUnique: jest.fn() },
    siteTeamMembership: { findUnique: jest.fn(), findMany: jest.fn() },
    derivation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
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
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDerivation', () => {
    const createDto = { teamId: 3, userId: 42, chantierId: 1 };

    beforeEach(() => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue({ id: 3 });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });
    });

    it('crée une dérivation avec un chantier', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.chantier.findUnique.mockResolvedValue(mockChantier);
      mockPrismaService.derivation.create.mockResolvedValue(mockDerivation);

      const result = await service.createDerivation(createDto, admin);

      expect(result).toEqual(mockDerivation);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
      });
      expect(mockPrismaService.chantier.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith({
        data: {
          teamId: 3,
          userId: 42,
          chantierId: 1,
          correctionComment: null,
          status: DerivationStatus.PENDING,
        },
        include: DERIVATION_INCLUDE,
      });
    });

    it('crée une dérivation sans chantier (chantierId null)', async () => {
      const dto = { teamId: 3, userId: 42 };
      const derivationSansChantier = {
        ...mockDerivation,
        chantierId: null,
        chantier: null,
      };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.derivation.create.mockResolvedValue(
        derivationSansChantier
      );

      const result = await service.createDerivation(dto, admin);

      expect(result).toEqual(derivationSansChantier);
      expect(mockPrismaService.chantier.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith({
        data: {
          teamId: 3,
          userId: 42,
          chantierId: null,
          correctionComment: null,
          status: DerivationStatus.PENDING,
        },
        include: DERIVATION_INCLUDE,
      });
    });

    it('crée une dérivation non attribuée quand seule l’équipe est fournie', async () => {
      mockPrismaService.derivation.create.mockResolvedValue({
        ...mockDerivation,
        userId: null,
      });

      await service.createDerivation({ teamId: 3 }, admin);

      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith({
        data: {
          teamId: 3,
          userId: null,
          chantierId: null,
          correctionComment: null,
          status: DerivationStatus.PENDING,
        },
        include: DERIVATION_INCLUDE,
      });
    });

    it("lève NotFoundException si l'équipe n'existe pas", async () => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
        'Team not found'
      );
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });

    it("lève BadRequestException si le technicien n'est pas membre de l'équipe", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });

    it("lève NotFoundException si l'utilisateur n'existe pas", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
        'User not found'
      );
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });

    it("lève NotFoundException si le chantier n'existe pas", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.chantier.findUnique.mockResolvedValue(null);

      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createDerivation(createDto, admin)).rejects.toThrow(
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
        include: DERIVATION_INCLUDE,
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
        include: DERIVATION_INCLUDE,
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
        include: DERIVATION_INCLUDE,
      });
    });
  });

  describe('updateDerivation', () => {
    it("met à jour le commentaire de correction d'une dérivation", async () => {
      const updated = {
        ...mockDerivation,
        correctionComment: 'Revoir section 3',
      };
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.derivation.update.mockResolvedValue(updated);

      const result = await service.updateDerivation(1, {
        correctionComment: 'Revoir section 3',
      });

      expect(result).toEqual(updated);
      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { correctionComment: 'Revoir section 3', status: undefined },
        include: DERIVATION_INCLUDE,
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

  describe('compteur de renvois en correction (DTA-54)', () => {
    it('incrémente le compteur quand la dérivation est renvoyée en correction', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        status: DerivationStatus.REVIEWING,
      });

      await service.updateDerivation(1, {
        status: DerivationStatus.REVISING,
        correctionComment: 'Photo floue',
      });

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ revisionCount: { increment: 1 } }),
        })
      );
    });

    it('ne compte pas deux fois une dérivation déjà en correction', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        status: DerivationStatus.REVISING,
      });

      await service.updateDerivation(1, {
        status: DerivationStatus.REVISING,
        correctionComment: 'Précision',
      });

      const { data } = mockPrismaService.derivation.update.mock.calls[0][0];
      expect(data.revisionCount).toBeUndefined();
    });

    it('ne compte pas une validation', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        status: DerivationStatus.REVIEWING,
      });

      await service.updateDerivation(1, {
        status: DerivationStatus.COMPLETED,
      });

      const { data } = mockPrismaService.derivation.update.mock.calls[0][0];
      expect(data.revisionCount).toBeUndefined();
    });
  });

  describe('getReviewStats (DTA-54)', () => {
    const mockCounts = (counts: number[], totalReturns: number | null) => {
      counts.forEach((count) =>
        mockPrismaService.derivation.count.mockResolvedValueOnce(count)
      );
      mockPrismaService.derivation.aggregate.mockResolvedValue({
        _sum: { revisionCount: totalReturns },
      });
    };

    it('calcule le taux de validation au 1er coup et le taux de retour', async () => {
      mockCounts([8, 6, 12, 6], 9);

      await expect(service.getReviewStats()).resolves.toEqual({
        completedCount: 8,
        firstTimeValidatedCount: 6,
        firstTimeValidationRate: 75,
        reviewedCount: 12,
        returnedCount: 6,
        returnRate: 50,
        totalReturns: 9,
      });
    });

    it('arrondit les taux au dixième', async () => {
      mockCounts([3, 1, 3, 2], 2);

      const stats = await service.getReviewStats();

      expect(stats.firstTimeValidationRate).toBe(33.3);
      expect(stats.returnRate).toBe(66.7);
    });

    it("retourne des taux nuls quand aucune dérivation n'a été revue", async () => {
      mockCounts([0, 0, 0, 0], null);

      await expect(service.getReviewStats()).resolves.toMatchObject({
        firstTimeValidationRate: null,
        returnRate: null,
        totalReturns: 0,
      });
    });

    it('compte les dérivations validées sans aucun renvoi', async () => {
      mockCounts([0, 0, 0, 0], 0);

      await service.getReviewStats();

      expect(mockPrismaService.derivation.count).toHaveBeenCalledWith({
        where: { status: DerivationStatus.COMPLETED, revisionCount: 0 },
      });
      expect(mockPrismaService.derivation.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { status: DerivationStatus.COMPLETED },
            { revisionCount: { gt: 0 } },
          ],
        },
      });
    });
  });

  describe('updateDerivation (assignment protection)', () => {
    it('ne transmet à Prisma que le commentaire et le statut', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);

      await service.updateDerivation(1, {
        status: DerivationStatus.REVISING,
        userId: 99,
        user: { connect: { id: 99 } },
      } as never);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          correctionComment: undefined,
          status: DerivationStatus.REVISING,
          revisionCount: { increment: 1 },
        },
        include: DERIVATION_INCLUDE,
      });
    });
  });

  describe('createDerivation (permissions)', () => {
    beforeEach(() => {
      mockPrismaService.siteTeam.findUnique.mockResolvedValue({ id: 3 });
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 42 });
      mockPrismaService.derivation.create.mockResolvedValue(mockDerivation);
    });

    it("force l'attribution au technicien qui crée la dérivation", async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await service.createDerivation({ teamId: 3, userId: 99 }, technician);

      expect(mockPrismaService.derivation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ teamId: 3, userId: 42 }),
        })
      );
    });

    it("refuse à un technicien de créer pour une équipe dont il n'est pas membre", async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(
        service.createDerivation({ teamId: 3 }, technician)
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.derivation.create).not.toHaveBeenCalled();
    });

    it('refuse à un chef de chantier de créer pour une autre équipe', async () => {
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(
        service.createDerivation({ teamId: 3 }, siteManager)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('assignTeam', () => {
    it("conserve l'attributaire s'il est membre de la nouvelle équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue({ id: 5 });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await service.assignTeam(1, 5);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { teamId: 5, userId: 42 },
        include: DERIVATION_INCLUDE,
      });
    });

    it("désattribue le technicien s'il n'est pas membre de la nouvelle équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue({ id: 5 });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await service.assignTeam(1, 5);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { teamId: 5, userId: null },
        include: DERIVATION_INCLUDE,
      });
    });

    it("lève NotFoundException si l'équipe n'existe pas", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeam.findUnique.mockResolvedValue(null);

      await expect(service.assignTeam(1, 5)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it("lève NotFoundException si la dérivation n'existe pas", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(null);

      await expect(service.assignTeam(999, 5)).rejects.toThrow(
        'Derivation not found'
      );
    });
  });

  describe('assignUser', () => {
    it("permet à un admin d'attribuer à un membre de l'équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        userId: null,
      });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await service.assignUser(1, 42, admin);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { userId: 42 },
        include: DERIVATION_INCLUDE,
      });
    });

    it("permet au chef de chantier de l'équipe d'attribuer, y compris à lui-même", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await service.assignUser(1, siteManager.userId, siteManager);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { userId: siteManager.userId },
        include: DERIVATION_INCLUDE,
      });
    });

    it('permet de désattribuer une dérivation', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await service.assignUser(1, null, siteManager);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { userId: null },
        include: DERIVATION_INCLUDE,
      });
    });

    it("refuse un chef de chantier qui n'appartient pas à l'équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(service.assignUser(1, 42, siteManager)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it("refuse un attributaire hors de l'équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(service.assignUser(1, 99, admin)).rejects.toThrow(
        BadRequestException
      );
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it("refuse si la dérivation n'a pas encore d'équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        teamId: null,
      });

      await expect(service.assignUser(1, 42, admin)).rejects.toThrow(
        'Derivation must be assigned to a team first'
      );
    });
  });

  describe('claimDerivation', () => {
    it("attribue une dérivation libre de l'équipe au technicien", async () => {
      mockPrismaService.derivation.findUnique
        .mockResolvedValueOnce({ ...mockDerivation, userId: null })
        .mockResolvedValueOnce(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrismaService.derivation.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.claimDerivation(1, technician);

      expect(result).toEqual(mockDerivation);
      expect(mockPrismaService.derivation.updateMany).toHaveBeenCalledWith({
        where: { id: 1, userId: null },
        data: { userId: 42 },
      });
    });

    it('est idempotent si la dérivation est déjà attribuée au technicien', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue(mockDerivation);
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await expect(service.claimDerivation(1, technician)).resolves.toEqual(
        mockDerivation
      );
      expect(mockPrismaService.derivation.updateMany).not.toHaveBeenCalled();
    });

    it('refuse si la dérivation est attribuée à un autre technicien', async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        userId: 99,
      });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });

      await expect(service.claimDerivation(1, technician)).rejects.toThrow(
        ConflictException
      );
      expect(mockPrismaService.derivation.updateMany).not.toHaveBeenCalled();
    });

    it("refuse si un autre technicien l'a prise entre-temps", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        userId: null,
      });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrismaService.derivation.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.claimDerivation(1, technician)).rejects.toThrow(
        ConflictException
      );
    });

    it("refuse un technicien qui n'est pas membre de l'équipe", async () => {
      mockPrismaService.derivation.findUnique.mockResolvedValue({
        ...mockDerivation,
        userId: null,
      });
      mockPrismaService.siteTeamMembership.findUnique.mockResolvedValue(null);

      await expect(service.claimDerivation(1, technician)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('findMyDerivations', () => {
    beforeEach(() => {
      mockPrismaService.siteTeamMembership.findMany.mockResolvedValue([
        { teamId: 3 },
        { teamId: 4 },
      ]);
      mockPrismaService.derivation.findMany.mockResolvedValue([mockDerivation]);
    });

    it('retourne au technicien ses dérivations et celles non attribuées de ses équipes', async () => {
      await service.findMyDerivations(technician);

      expect(mockPrismaService.derivation.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ userId: 42 }, { userId: null, teamId: { in: [3, 4] } }],
        },
        include: DERIVATION_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('retourne au chef de chantier toutes les dérivations de ses équipes', async () => {
      await service.findMyDerivations(siteManager);

      expect(mockPrismaService.derivation.findMany).toHaveBeenCalledWith({
        where: { OR: [{ teamId: { in: [3, 4] } }, { userId: 7 }] },
        include: DERIVATION_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
