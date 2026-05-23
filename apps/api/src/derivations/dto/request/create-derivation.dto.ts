import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDerivationDto {
  @ApiProperty({ example: 1, description: 'The id of the user' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'The id of the chantier' })
  @IsNumber()
  @IsOptional()
  chantierId?: number;

  @ApiProperty({ example: 'Comment', description: 'The correction comment' })
  @IsString()
  @IsOptional()
  correctionComment?: string;
}
