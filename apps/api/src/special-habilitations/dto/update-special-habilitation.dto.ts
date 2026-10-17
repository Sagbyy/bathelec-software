import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDocumentExpiryDate } from '../../common/validators/is-document-expiry-date.validator';

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

  @IsDocumentExpiryDate('electricalTitleDoc')
  @ApiPropertyOptional({ example: '2027-05-31', nullable: true })
  electricalTitleDocExpiresAt?: string | null;

  @IsDocumentExpiryDate('ss4TitleDoc')
  @ApiPropertyOptional({ example: '2027-05-31', nullable: true })
  ss4TitleDocExpiresAt?: string | null;

  @IsDocumentExpiryDate('leadTitleDoc')
  @ApiPropertyOptional({ example: '2027-05-31', nullable: true })
  leadTitleDocExpiresAt?: string | null;

  @IsDocumentExpiryDate('sstCertificateDoc')
  @ApiPropertyOptional({ example: '2027-05-31', nullable: true })
  sstCertificateDocExpiresAt?: string | null;
}
