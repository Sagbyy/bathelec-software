import {
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHabilitationDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b0?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  bs?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  be?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h0?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h0v?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b1?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b1v?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h1?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h1v?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b2?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b2v?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  b2vEssais?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h2?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h2v?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  h2vEssais?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  bc?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hc?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  br?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  beAttribut?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  heAttribut?: boolean;

  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the NF C 18-510 habilitation title, required as soon as a code is granted',
  })
  expiresAt?: string | null;
}
