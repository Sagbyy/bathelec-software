import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SpecialHabilitation,
  SpecialHabilitationDocument,
} from './entities/special-habilitation.entity';
import { UpdateSpecialHabilitationDto } from './dto/update-special-habilitation.dto';
import { UsersService } from '../users/users.service';
import { clearExpiryOfRemovedDocuments } from '../common/validators/is-document-expiry-date.validator';

const SPECIAL_HABILITATION_DOCUMENT_KEYS = [
  'electricalTitleDoc',
  'ss4TitleDoc',
  'leadTitleDoc',
  'sstCertificateDoc',
] as const;

const DEFAULT_SPECIAL_HABILITATIONS = {
  electricalTitle: false,
  electricalTitleDoc: null,
  electricalTitleDocExpiresAt: null,
  ss4Title: false,
  ss4TitleDoc: null,
  ss4TitleDocExpiresAt: null,
  leadTitle: false,
  leadTitleDoc: null,
  leadTitleDocExpiresAt: null,
  sstCertificate: false,
  sstCertificateDoc: null,
  sstCertificateDocExpiresAt: null,
};

@Injectable()
export class SpecialHabilitationsService {
  constructor(
    @InjectModel(SpecialHabilitation.name)
    private readonly model: Model<SpecialHabilitationDocument>,
    private readonly usersService: UsersService
  ) {}

  async findByUserId(userId: number) {
    const doc = await this.model.findOne({ userId });
    return doc ?? { userId, ...DEFAULT_SPECIAL_HABILITATIONS };
  }

  async upsert(
    userId: number,
    dto: UpdateSpecialHabilitationDto
  ): Promise<SpecialHabilitationDocument> {
    const user = await this.usersService.findOneById(userId);
    if (!user || user.role !== 'technician') {
      throw new ForbiddenException(
        "Les habilitations ne peuvent être assignées qu'à un technicien."
      );
    }

    return this.model.findOneAndUpdate(
      { userId },
      {
        $set: clearExpiryOfRemovedDocuments(
          dto,
          SPECIAL_HABILITATION_DOCUMENT_KEYS
        ),
      },
      { upsert: true, new: true }
    );
  }
}
