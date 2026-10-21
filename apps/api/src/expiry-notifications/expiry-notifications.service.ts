import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import {
  OfficialDocument,
  OfficialDocumentDocument,
} from '../official-documents/entities/official-document.entity';
import {
  VehicleDocument,
  VehicleDocumentDocument,
} from '../vehicle-documents/entities/vehicle-document.entity';
import {
  SpecialHabilitation,
  SpecialHabilitationDocument,
} from '../special-habilitations/entities/special-habilitation.entity';
import {
  Habilitation,
  HabilitationDocument,
} from '../habilitations/entities/habilitation.entity';
import { ExpiryMailerService } from './expiry-mailer.service';
import { daysUntil, reachedThreshold } from './lib/expiry-thresholds';
import {
  OFFICIAL_DOCUMENTS,
  SPECIAL_HABILITATION_DOCUMENTS,
  TrackedDocument,
  VEHICLE_DOCUMENTS,
  trackAttachedDocuments,
  trackHabilitations,
} from './lib/tracked-documents';

const MANAGEMENT_ROLES: string[] = [Role.ADMIN, Role.SUPERVISOR];

type StoredRecord = { userId: number } & Record<string, unknown>;

@Injectable()
export class ExpiryNotificationsService {
  private readonly logger = new Logger(ExpiryNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: ExpiryMailerService,
    @InjectModel(OfficialDocument.name)
    private readonly officialDocuments: Model<OfficialDocumentDocument>,
    @InjectModel(VehicleDocument.name)
    private readonly vehicleDocuments: Model<VehicleDocumentDocument>,
    @InjectModel(SpecialHabilitation.name)
    private readonly specialHabilitations: Model<SpecialHabilitationDocument>,
    @InjectModel(Habilitation.name)
    private readonly habilitations: Model<HabilitationDocument>
  ) {}

  async scan(today = new Date()) {
    const technicians = await this.prisma.user.findMany({
      where: { role: Role.TECHNICIAN },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    const managers = await this.prisma.user.findMany({
      where: { role: { in: MANAGEMENT_ROLES } },
      select: { email: true },
    });
    const technicianById = new Map(technicians.map((t) => [t.id, t]));
    const documents = await this.collectTrackedDocuments(
      technicians.map(({ id }) => id)
    );

    let created = 0;
    for (const document of documents) {
      const threshold = reachedThreshold(document.expiresAt, today);
      const technician = technicianById.get(document.technicianId);
      if (!threshold || !technician) continue;
      if (!(await this.createIfNew(document, threshold))) continue;

      created += 1;
      await this.mailer.send({
        recipients: [technician.email, ...managers.map(({ email }) => email)],
        technicianName: `${technician.firstName} ${technician.lastName}`,
        documentLabel: document.documentLabel,
        expiresAt: document.expiresAt,
        remainingDays: daysUntil(document.expiresAt, today),
      });
    }

    this.logger.log(`Expiry scan done: ${created} new notification(s)`);
    return { created };
  }

  async findForUser(actor: AuthenticatedUser) {
    const notifications = await this.prisma.expiryNotification.findMany({
      where: MANAGEMENT_ROLES.includes(actor.role)
        ? {}
        : { technicianId: actor.userId },
      include: {
        technician: { select: { firstName: true, lastName: true } },
        receipts: { where: { userId: actor.userId }, select: { userId: true } },
      },
      orderBy: [{ expiresAt: 'asc' }, { threshold: 'asc' }],
    });

    return notifications.map(({ technician, receipts, ...notification }) => ({
      ...notification,
      technicianName: `${technician.firstName} ${technician.lastName}`,
      acknowledged: receipts.length > 0,
    }));
  }

  async acknowledge(notificationId: number, actor: AuthenticatedUser) {
    const notification = await this.prisma.expiryNotification.findUnique({
      where: { id: notificationId },
      select: { technicianId: true },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (
      !MANAGEMENT_ROLES.includes(actor.role) &&
      notification.technicianId !== actor.userId
    ) {
      throw new ForbiddenException('This notification is not addressed to you');
    }

    return this.prisma.expiryNotificationReceipt.upsert({
      where: {
        notificationId_userId: { notificationId, userId: actor.userId },
      },
      update: {},
      create: { notificationId, userId: actor.userId },
    });
  }

  private async createIfNew(document: TrackedDocument, threshold: number) {
    const key = {
      technicianId: document.technicianId,
      documentKey: document.documentKey,
      expiresAt: document.expiresAt,
      threshold,
    };
    const existing = await this.prisma.expiryNotification.findUnique({
      where: { technicianId_documentKey_expiresAt_threshold: key },
      select: { id: true },
    });
    if (existing) return false;

    await this.prisma.expiryNotification.create({
      data: { ...key, documentLabel: document.documentLabel },
    });
    return true;
  }

  private async collectTrackedDocuments(technicianIds: number[]) {
    const byTechnician = { userId: { $in: technicianIds } };
    const [official, vehicle, special, habilitations] = await Promise.all([
      this.officialDocuments.find(byTechnician).lean(),
      this.vehicleDocuments.find(byTechnician).lean(),
      this.specialHabilitations.find(byTechnician).lean(),
      this.habilitations.find(byTechnician).lean(),
    ]);
    const asRecords = (records: unknown[]) => records as StoredRecord[];

    return [
      ...trackAttachedDocuments(asRecords(official), OFFICIAL_DOCUMENTS),
      ...trackAttachedDocuments(asRecords(vehicle), VEHICLE_DOCUMENTS),
      ...trackAttachedDocuments(
        asRecords(special),
        SPECIAL_HABILITATION_DOCUMENTS
      ),
      ...trackHabilitations(asRecords(habilitations)),
    ];
  }
}
