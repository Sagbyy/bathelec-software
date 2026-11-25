import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { DerivationStatus } from '../../../types/derivations-status.enum';
import { REVIEW_DECISIONS } from '../../access/derivation-access.policy';

export class UpdateDerivationDto {
  @ApiProperty({ example: 'Comment', required: false, nullable: true })
  @IsString()
  @IsOptional()
  correctionComment?: string | null;

  @ApiProperty({ enum: REVIEW_DECISIONS, required: false })
  @IsIn(REVIEW_DECISIONS)
  @IsOptional()
  status?: DerivationStatus;
}
