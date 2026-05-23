import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSpecialHabilitationDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  electricalTitle?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  electricalTitleDoc?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  ss4Title?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  ss4TitleDoc?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  leadTitle?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  leadTitleDoc?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  sstCertificate?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sstCertificateDoc?: string | null;
}
