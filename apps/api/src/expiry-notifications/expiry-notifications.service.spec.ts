import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { OfficialDocument } from '../official-documents/entities/official-document.entity';
import { VehicleDocument } from '../vehicle-documents/entities/vehicle-document.entity';
import { SpecialHabilitation } from '../special-habilitations/entities/special-habilitation.entity';
import { Habilitation } from '../habilitations/entities/habilitation.entity';
import { ExpiryMailerService } from './expiry-mailer.service';
import { ExpiryNotificationsService } from './expiry-notifications.service';

const today = new Date('2026-10-17T07:00:00.000Z');
const inDays = (days: number) =>
  new Date(Date.UTC(2026, 9, 17 + days, 0, 0, 0));

const technician = {
  id: 4,
  email: 'tech@bathelec.fr',
  firstName: 'Jean',
  lastName: 'Tech',
};

const mongoModel = (records: unknown[] = []) => ({
  find: jest.fn().mockReturnValue({ lean: () => Promise.resolve(records) }),
});

describe('ExpiryNotificationsService', () => {
  let service: ExpiryNotificationsService;
  const prisma = {
    user: { findMany: jest.fn() },
    expiryNotification: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    expiryNotificationReceipt: { upsert: jest.fn() },
  };
  const mailer = { send: jest.fn() };
  let official = mongoModel();
  let vehicle = mongoModel();

  const build = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpiryNotificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: ExpiryMailerService, useValue: mailer },
        { provide: getModelToken(OfficialDocument.name), useValue: official },
        { provide: getModelToken(VehicleDocument.name), useValue: vehicle },
        {
          provide: getModelToken(SpecialHabilitation.name),
          useValue: mongoModel(),
        },
        { provide: getModelToken(Habilitation.name), useValue: mongoModel() },
      ],
    }).compile();
    service = module.get(ExpiryNotificationsService);
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    official = mongoModel();
    vehicle = mongoModel();
    prisma.user.findMany
      .mockResolvedValueOnce([technician])
      .mockResolvedValueOnce([{ email: 'admin@bathelec.fr' }]);
    prisma.expiryNotification.findUnique.mockResolvedValue(null);
    await build();
  });

  describe('scan', () => {
    it('creates a notification and e-mails the technician and managers', async () => {
      vehicle = mongoModel([
        {
          userId: 4,
          drivingLicense: 'data:image/png;base64,AAA',
          drivingLicenseExpiresAt: inDays(30),
        },
      ]);
      await build();

      await expect(service.scan(today)).resolves.toEqual({ created: 1 });

      expect(prisma.expiryNotification.create).toHaveBeenCalledWith({
        data: {
          technicianId: 4,
          documentKey: 'drivingLicense',
          documentLabel: 'Permis de conduire',
          expiresAt: inDays(30),
          threshold: 30,
        },
      });
      expect(mailer.send).toHaveBeenCalledWith({
        recipients: ['tech@bathelec.fr', 'admin@bathelec.fr'],
        technicianName: 'Jean Tech',
        documentLabel: 'Permis de conduire',
        expiresAt: inDays(30),
        remainingDays: 30,
      });
    });

    it('notifies each threshold only once', async () => {
      official = mongoModel([
        {
          userId: 4,
          idCard: 'data:image/png;base64,AAA',
          idCardExpiresAt: inDays(12),
        },
      ]);
      await build();
      prisma.expiryNotification.findUnique.mockResolvedValue({ id: 9 });

      await expect(service.scan(today)).resolves.toEqual({ created: 0 });
      expect(prisma.expiryNotification.create).not.toHaveBeenCalled();
      expect(mailer.send).not.toHaveBeenCalled();
    });

    it('ignores documents expiring in more than 60 days or already expired', async () => {
      official = mongoModel([
        {
          userId: 4,
          idCard: 'data:image/png;base64,AAA',
          idCardExpiresAt: inDays(61),
          btpCard: 'data:image/png;base64,BBB',
          btpCardExpiresAt: inDays(-2),
        },
      ]);
      await build();

      await expect(service.scan(today)).resolves.toEqual({ created: 0 });
    });

    it('only scans documents of technicians', async () => {
      await service.scan(today);

      expect(prisma.user.findMany).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ where: { role: Role.TECHNICIAN } })
      );
      expect(official.find).toHaveBeenCalledWith({ userId: { $in: [4] } });
    });
  });

  describe('findForUser', () => {
    const stored = {
      id: 1,
      technicianId: 4,
      documentKey: 'idCard',
      documentLabel: "Pièce d'identité ou titre de séjour",
      expiresAt: inDays(15),
      threshold: 15,
      createdAt: today,
      technician: { firstName: 'Jean', lastName: 'Tech' },
    };

    it('shows a technician only the notifications about their documents', async () => {
      prisma.expiryNotification.findMany.mockResolvedValue([
        { ...stored, receipts: [] },
      ]);

      const result = await service.findForUser({
        userId: 4,
        username: 'tech',
        role: Role.TECHNICIAN,
      });

      expect(prisma.expiryNotification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { technicianId: 4 } })
      );
      expect(result).toEqual([
        expect.objectContaining({
          id: 1,
          technicianName: 'Jean Tech',
          acknowledged: false,
        }),
      ]);
    });

    it('shows managers every notification with their own read receipt', async () => {
      prisma.expiryNotification.findMany.mockResolvedValue([
        { ...stored, receipts: [{ userId: 1 }] },
      ]);

      const [notification] = await service.findForUser({
        userId: 1,
        username: 'admin',
        role: Role.SUPERVISOR,
      });

      expect(prisma.expiryNotification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
      expect(notification.acknowledged).toBe(true);
    });
  });

  describe('acknowledge', () => {
    it('records the read receipt of the current user', async () => {
      prisma.expiryNotification.findUnique.mockResolvedValue({
        technicianId: 4,
      });

      await service.acknowledge(1, {
        userId: 4,
        username: 'tech',
        role: Role.TECHNICIAN,
      });

      expect(prisma.expiryNotificationReceipt.upsert).toHaveBeenCalledWith({
        where: { notificationId_userId: { notificationId: 1, userId: 4 } },
        update: {},
        create: { notificationId: 1, userId: 4 },
      });
    });

    it('refuses a technician acknowledging another technician notification', async () => {
      prisma.expiryNotification.findUnique.mockResolvedValue({
        technicianId: 5,
      });

      await expect(
        service.acknowledge(1, {
          userId: 4,
          username: 'tech',
          role: Role.TECHNICIAN,
        })
      ).rejects.toThrow(ForbiddenException);
    });

    it('fails on an unknown notification', async () => {
      prisma.expiryNotification.findUnique.mockResolvedValue(null);

      await expect(
        service.acknowledge(99, {
          userId: 1,
          username: 'admin',
          role: Role.ADMIN,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
