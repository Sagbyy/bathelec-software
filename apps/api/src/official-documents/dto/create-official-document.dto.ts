import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class CreateOfficialDocumentDto {
  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: "Pièce d'identité en base64 (jpeg, png, webp — max 5MB)",
  })
  pieceIdentite?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Carte professionnelle BTP en base64 (jpeg, png, webp — max 5MB)',
  })
  carteProBtp?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Carte mutuelle en base64 (jpeg, png, webp — max 5MB)',
  })
  carteMutuelle?: string;
}
