import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDerivationDto {
  @ApiProperty({ example: 1, description: 'The id of the site team' })
  @IsInt()
  teamId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the assigned user, must belong to the team',
    required: false,
  })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({ example: 1, description: 'The id of the chantier' })
  @IsNumber()
  @IsOptional()
  chantierId?: number;

  @ApiProperty({ example: 'Comment', description: 'The correction comment' })
  @IsString()
  @IsOptional()
  correctionComment?: string;
}
