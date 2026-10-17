import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { Role as UserRole } from '@repo/types';
import { ChantiersController } from './chantiers.controller';
import { ChantiersService } from './chantiers.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from '../role/role.guard';
import { ROLE_METADATA_KEY } from '../role/role.decorator';
import { UpdateChantierDto } from './dto/request/update-chantier.dto';

const mockChantier = {
  id: 1,
  address: '3 RUE PAILLET 75005 PARIS',
  enedisAffaireNumber: 'DC21/014312',
  internalAffaireNumber: 'BA570035',
  marketId: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  market: { id: 1, name: 'DR Paris' },
};

const mockChantiersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOngoing: jest.fn(),
  findFinished: jest.fn(),
  findScheduledForUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ChantiersController', () => {
  let controller: ChantiersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChantiersController],
      providers: [
        { provide: ChantiersService, useValue: mockChantiersService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChantiersController>(ChantiersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('crée un chantier', async () => {
      mockChantiersService.create.mockResolvedValue(mockChantier);
      const dto = {
        address: '3 RUE PAILLET 75005 PARIS',
        enedisAffaireNumber: 'DC21/014312',
        internalAffaireNumber: 'BA570035',
        marketId: 1,
      };

      const result = await controller.create(dto);

      expect(result).toEqual(mockChantier);
      expect(mockChantiersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('retourne tous les chantiers', async () => {
      mockChantiersService.findAll.mockResolvedValue([mockChantier]);

      const result = await controller.findAll();

      expect(result).toEqual([mockChantier]);
      expect(mockChantiersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOngoing', () => {
    it('retourne les chantiers en cours', async () => {
      const ongoing = { ...mockChantier, derivations: [] };
      mockChantiersService.findOngoing.mockResolvedValue([ongoing]);

      const result = await controller.findOngoing();

      expect(result).toEqual([ongoing]);
      expect(mockChantiersService.findOngoing).toHaveBeenCalledTimes(1);
    });
  });

  describe('findFinished', () => {
    it('retourne les chantiers terminés', async () => {
      const finished = {
        ...mockChantier,
        derivations: [{ id: 1, status: 'Completed' }],
      };
      mockChantiersService.findFinished.mockResolvedValue([finished]);

      const result = await controller.findFinished();

      expect(result).toEqual([finished]);
      expect(mockChantiersService.findFinished).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('retourne un chantier par id (param string → number)', async () => {
      mockChantiersService.findOne.mockResolvedValue(mockChantier);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockChantier);
      expect(mockChantiersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('met à jour un chantier', async () => {
      const updated = {
        ...mockChantier,
        address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      };
      mockChantiersService.update.mockResolvedValue(updated);

      const result = await controller.update('1', {
        address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      });

      expect(result).toEqual(updated);
      expect(mockChantiersService.update).toHaveBeenCalledWith(1, {
        address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      });
    });
  });

  describe('remove', () => {
    it('supprime un chantier', async () => {
      mockChantiersService.remove.mockResolvedValue(mockChantier);

      const result = await controller.remove('1');

      expect(result).toEqual(mockChantier);
      expect(mockChantiersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('protection des routes admin via RoleGuard', () => {
    it('applique RoleGuard sur create', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ChantiersController.prototype.create
      );
      expect(guards).toContain(RoleGuard);
    });

    it('applique RoleGuard sur update', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ChantiersController.prototype.update
      );
      expect(guards).toContain(RoleGuard);
    });

    it('applique RoleGuard sur remove', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ChantiersController.prototype.remove
      );
      expect(guards).toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findAll", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          ChantiersController.prototype.findAll
        ) ?? [];
      expect(guards).not.toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findOne", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          ChantiersController.prototype.findOne
        ) ?? [];
      expect(guards).not.toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findOngoing", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          ChantiersController.prototype.findOngoing
        ) ?? [];
      expect(guards).not.toContain(RoleGuard);
    });

    it("n'applique pas RoleGuard sur findFinished", () => {
      const guards =
        Reflect.getMetadata(
          '__guards__',
          ChantiersController.prototype.findFinished
        ) ?? [];
      expect(guards).not.toContain(RoleGuard);
    });
  });

  describe('findScheduled', () => {
    it("délègue au service avec l'utilisateur courant", async () => {
      mockChantiersService.findScheduledForUser.mockResolvedValue([
        mockChantier,
      ]);

      const result = await controller.findScheduled({
        userId: 42,
        username: 'tech',
        role: UserRole.TECHNICIAN,
      });

      expect(result).toEqual([mockChantier]);
      expect(mockChantiersService.findScheduledForUser).toHaveBeenCalledWith(
        42
      );
    });

    it('réserve les chantiers programmés aux techniciens et chefs de chantier', () => {
      expect(
        Reflect.getMetadata(
          ROLE_METADATA_KEY,
          ChantiersController.prototype.findScheduled
        )
      ).toEqual([UserRole.TECHNICIAN, UserRole.SITE_MANAGER]);
    });
  });

  describe('validation de la mise à jour', () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const asBody = {
      type: 'body',
      metatype: UpdateChantierDto,
    } as ArgumentMetadata;

    it('accepte des dates ISO et leur retrait', async () => {
      await expect(
        pipe.transform({ startDate: '2026-11-03', endDate: null }, asBody)
      ).resolves.toEqual({ startDate: '2026-11-03', endDate: null });
    });

    it.each([[{ startDate: 'demain' }], [{ derivations: { create: {} } }]])(
      'rejette %j',
      async (body) => {
        await expect(pipe.transform(body, asBody)).rejects.toThrow();
      }
    );
  });

  describe('rôles autorisés', () => {
    it('ouvre la création de chantier à admin et encadrant', () => {
      const roles = Reflect.getMetadata(
        ROLE_METADATA_KEY,
        ChantiersController.prototype.create
      );
      expect(roles).toEqual([UserRole.ADMIN, UserRole.SUPERVISOR]);
    });

    it('réserve la mise à jour et la suppression aux admins', () => {
      expect(
        Reflect.getMetadata(
          ROLE_METADATA_KEY,
          ChantiersController.prototype.update
        )
      ).toEqual([UserRole.ADMIN]);
      expect(
        Reflect.getMetadata(
          ROLE_METADATA_KEY,
          ChantiersController.prototype.remove
        )
      ).toEqual([UserRole.ADMIN]);
    });
  });
});
