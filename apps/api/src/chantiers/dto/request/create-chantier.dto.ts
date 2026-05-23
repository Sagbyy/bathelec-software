import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateChantierDto {
  @ApiProperty({
    example: '12 Rue de la Paix',
    description: 'The address of the chantier',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    example: 'AFF-ENEDIS-2024-001',
    description: 'Enedis affaire number',
  })
  @IsString()
  @MinLength(2)
  enedisAffaireNumber: string;

  @ApiProperty({
    example: 'INT-2024-001',
    description: 'Internal affaire number',
  })
  @IsString()
  @MinLength(2)
  internalAffaireNumber: string;

  @ApiProperty({ example: 1, description: 'The id of the associated market' })
  @IsNumber()
  marketId: number;
}
