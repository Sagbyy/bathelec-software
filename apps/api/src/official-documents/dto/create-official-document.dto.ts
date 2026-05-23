import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class CreateOfficialDocumentDto {
  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'ID card or residence permit in base64 (jpeg, png, webp — max 5MB)',
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
}
