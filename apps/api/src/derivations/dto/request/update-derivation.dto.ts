import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DerivationStatus } from '../../../types/derivations-status.enum';

export class UpdateDerivationDto {
  @ApiProperty({ example: 'Comment', required: false, nullable: true })
  @IsString()
  @IsOptional()
  correctionComment?: string | null;

  @ApiProperty({ enum: DerivationStatus, required: false })
  @IsEnum(DerivationStatus)
  @IsOptional()
  status?: DerivationStatus;
}
