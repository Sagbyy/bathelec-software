import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

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

  @ApiPropertyOptional({
    example: '2026-11-03',
    description: 'Scheduled start date of the chantier',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  startDate?: string | null;

  @ApiPropertyOptional({
    example: '2026-11-07',
    description: 'Scheduled end date of the chantier',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  endDate?: string | null;
}
