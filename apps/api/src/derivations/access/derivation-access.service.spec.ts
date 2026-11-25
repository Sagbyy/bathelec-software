import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@repo/types';
import { PrismaService } from '../../prisma/prisma.service';
import { DerivationStatus } from '../../types/derivations-status.enum';
import { DerivationAccessService } from './derivation-access.service';

const technician = { userId: 42, role: Role.TECHNICIAN };

const derivation = {
  id: 1,
  userId: 42,
  teamId: 3,
  status: DerivationStatus.PENDING,
};

describe('DerivationAccessService', () => {
  const prisma = {
    derivation: { findUnique: jest.fn() },
    siteTeamMembership: { findUnique: jest.fn() },
  };
  const service = new DerivationAccessService(
    prisma as unknown as PrismaService
  );

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.siteTeamMembership.findUnique.mockResolvedValue({ teamId: 3 });
  });

  describe('findViewableOrThrow', () => {
    it('retourne la dérivation du technicien attribué', async () => {
      prisma.derivation.findUnique.mockResolvedValue(derivation);

      await expect(service.findViewableOrThrow(1, technician)).resolves.toEqual(
        derivation
      );
    });

    it('refuse la dérivation attribuée à un collègue (ENF-03)', async () => {
      prisma.derivation.findUnique.mockResolvedValue({
        ...derivation,
        userId: 99,
      });

      await expect(service.findViewableOrThrow(1, technician)).rejects.toThrow(
        ForbiddenException
      );
    });

    it("lève NotFoundException si la dérivation n'existe pas", async () => {
      prisma.derivation.findUnique.mockResolvedValue(null);

      await expect(service.findViewableOrThrow(1, technician)).rejects.toThrow(
        NotFoundException
      );
    });

    it("ne consulte pas l'équipe d'une dérivation sans équipe", async () => {
      prisma.derivation.findUnique.mockResolvedValue({
        ...derivation,
        userId: 99,
        teamId: null,
      });

      await expect(service.findViewableOrThrow(1, technician)).rejects.toThrow(
        ForbiddenException
      );
      expect(prisma.siteTeamMembership.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('findFillableOrThrow', () => {
    it.each([
      [DerivationStatus.PENDING],
      [DerivationStatus.ONGOING],
      [DerivationStatus.REVISING],
    ])('autorise la saisie au statut %s', async (status) => {
      prisma.derivation.findUnique.mockResolvedValue({ ...derivation, status });

      await expect(
        service.findFillableOrThrow(1, technician)
      ).resolves.toMatchObject({ status });
    });

    it.each([[DerivationStatus.REVIEWING], [DerivationStatus.COMPLETED]])(
      'refuse la saisie au statut %s (RG-04)',
      async (status) => {
        prisma.derivation.findUnique.mockResolvedValue({
          ...derivation,
          status,
        });

        await expect(
          service.findFillableOrThrow(1, technician)
        ).rejects.toThrow(ConflictException);
      }
    );

    it('refuse de remplir la dérivation d’un collègue', async () => {
      prisma.derivation.findUnique.mockResolvedValue({
        ...derivation,
        userId: 99,
      });

      await expect(service.findFillableOrThrow(1, technician)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
