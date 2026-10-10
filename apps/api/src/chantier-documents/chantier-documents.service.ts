import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChantierDocument,
  ChantierDocumentDocument,
} from './entities/chantier-document.entity';
import { CreateChantierDocumentDto } from './dto/create-chantier-document.dto';

const METADATA_PROJECTION = '-file';

@Injectable()
export class ChantierDocumentsService {
  constructor(
    @InjectModel(ChantierDocument.name)
    private readonly chantierDocumentModel: Model<ChantierDocumentDocument>
  ) {}

  async create(
    chantierId: number,
    uploadedById: number,
    createChantierDocumentDto: CreateChantierDocumentDto
  ): Promise<ChantierDocumentDocument> {
    const { mimeType, size } = this.parseDataUrl(createChantierDocumentDto.file);

    const chantierDocument = new this.chantierDocumentModel({
      ...createChantierDocumentDto,
      chantierId,
      uploadedById,
      mimeType,
      size,
    });

    return chantierDocument.save();
  }

  async findByChantier(
    chantierId: number
  ): Promise<ChantierDocumentDocument[]> {
    return this.chantierDocumentModel
      .find({ chantierId })
      .select(METADATA_PROJECTION)
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<ChantierDocumentDocument> {
    return this.chantierDocumentModel.findById(id);
  }

  async remove(id: string): Promise<ChantierDocumentDocument> {
    return this.chantierDocumentModel.findByIdAndDelete(id);
  }

  private parseDataUrl(file: string): { mimeType: string; size: number } {
    const match = file.match(/^data:([^;]+);base64,(.+)$/);

    if (!match) {
      throw new BadRequestException('Invalid file format');
    }

    const [, mimeType, base64Data] = match;
    const size = Math.floor((base64Data.length * 3) / 4);

    return { mimeType, size };
  }
}
