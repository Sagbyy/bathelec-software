import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class CreateVehicleDocumentDto {
  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'La carte grise en base64 (jpeg, png, webp — max 5MB)',
  })
  carteGrise?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Le permis de conduire en base64 (jpeg, png, webp — max 5MB)',
  })
  permisDeConduire?: string;
}
