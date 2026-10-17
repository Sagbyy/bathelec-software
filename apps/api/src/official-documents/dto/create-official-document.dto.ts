import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';
import { IsDocumentExpiryDate } from '../../common/validators/is-document-expiry-date.validator';

export class CreateOfficialDocumentDto {
  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description:
      'ID card or residence permit in base64 (jpeg, png, webp — max 5MB)',
  })
  idCard?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'BTP professional card in base64 (jpeg, png, webp — max 5MB)',
  })
  btpCard?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Mutual insurance card in base64 (jpeg, png, webp — max 5MB)',
  })
  mutualCard?: string;

  @IsDocumentExpiryDate('idCard')
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the ID card or residence permit, required when the document is provided',
  })
  idCardExpiresAt?: string | null;

  @IsDocumentExpiryDate('btpCard')
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the BTP professional card, required when the document is provided',
  })
  btpCardExpiresAt?: string | null;

  @IsDocumentExpiryDate('mutualCard')
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the mutual insurance card, required when the document is provided',
  })
  mutualCardExpiresAt?: string | null;
}
