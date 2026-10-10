import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ChantierDocumentType,
  CHANTIER_DOCUMENT_TYPE_VALUES,
} from '@repo/types';
import { IsBase64Document } from '../../common/validators/is-base64-document.validator';

export class CreateChantierDocumentDto {
  @ApiProperty({
    example: 'Étude de marché 2026',
    description: 'The display name of the document',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: ChantierDocumentType,
    example: ChantierDocumentType.MARKET_STUDY,
    description: 'The category of the chantier document',
  })
  @IsIn(CHANTIER_DOCUMENT_TYPE_VALUES)
  type: ChantierDocumentType;

  @ApiProperty({
    example: 'data:application/pdf;base64,...',
    description: 'The file as a base64 data URL (PDF or image, max 10MB)',
  })
  @IsBase64Document()
  file: string;
}
