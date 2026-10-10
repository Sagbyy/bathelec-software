import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChantierDocument,
  ChantierDocumentDocument,
} from './entities/chantier-document.entity';
import { CreateChantierDocumentDto } from './dto/create-chantier-document.dto';
import { decodedByteLength } from '../common/validators/is-base64-document.validator';

const METADATA_PROJECTION = '-file';
const BASE64_MARKER = ';base64,';

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

    const saved = await chantierDocument.save();
    saved.file = undefined;

    return saved;
  }

  async findByChantier(
    chantierId: number
  ): Promise<ChantierDocumentDocument[]> {
    return await this.chantierDocumentModel
      .find({ chantierId })
      .select(METADATA_PROJECTION)
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<ChantierDocumentDocument> {
    return await this.chantierDocumentModel.findById(id);
  }

  async remove(id: string): Promise<ChantierDocumentDocument> {
    return await this.chantierDocumentModel.findByIdAndDelete(id);
  }

  private parseDataUrl(file: string): { mimeType: string; size: number } {
    const markerIndex = file.indexOf(BASE64_MARKER);

    if (!file.startsWith('data:') || markerIndex === -1) {
      throw new BadRequestException('Invalid file format');
    }

    const mimeType = file.slice('data:'.length, markerIndex);
    const base64Data = file.slice(markerIndex + BASE64_MARKER.length);
    const size = decodedByteLength(base64Data);

    return { mimeType, size };
  }
}
