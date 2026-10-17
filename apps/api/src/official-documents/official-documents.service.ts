import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OfficialDocument,
  OfficialDocumentDocument,
} from './entities/official-document.entity';
import { CreateOfficialDocumentDto } from './dto/create-official-document.dto';
import { UpdateOfficialDocumentDto } from './dto/update-official-document.dto';

import { clearExpiryOfRemovedDocuments } from '../common/validators/is-document-expiry-date.validator';

const OFFICIAL_DOCUMENT_KEYS = ['idCard', 'btpCard', 'mutualCard'] as const;

@Injectable()
export class OfficialDocumentsService {
  constructor(
    @InjectModel(OfficialDocument.name)
    private officialDocumentModel: Model<OfficialDocumentDocument>
  ) {}

  async createOrUpdate(
    userId: number,
    createOfficialDocumentDto: CreateOfficialDocumentDto
  ): Promise<OfficialDocumentDocument> {
    const existing = await this.officialDocumentModel
      .findOne({ userId })
      .lean();

    if (existing) {
      return this.officialDocumentModel.findOneAndUpdate(
        { userId },
        {
          ...clearExpiryOfRemovedDocuments(
            createOfficialDocumentDto,
            OFFICIAL_DOCUMENT_KEYS
          ),
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    const officialDocument = new this.officialDocumentModel({
      ...createOfficialDocumentDto,
      userId,
    });
    return officialDocument.save();
  }

  async findByUserId(userId: number): Promise<OfficialDocumentDocument> {
    return this.officialDocumentModel.findOne({ userId });
  }

  async update(
    userId: number,
    updateOfficialDocumentDto: UpdateOfficialDocumentDto
  ): Promise<OfficialDocumentDocument> {
    return this.officialDocumentModel.findOneAndUpdate(
      { userId },
      {
        ...clearExpiryOfRemovedDocuments(
          updateOfficialDocumentDto,
          OFFICIAL_DOCUMENT_KEYS
        ),
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async remove(userId: number): Promise<OfficialDocumentDocument> {
    return this.officialDocumentModel.findOneAndDelete({ userId });
  }
}
