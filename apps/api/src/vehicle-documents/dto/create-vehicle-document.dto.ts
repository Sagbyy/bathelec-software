import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';
import { IsDocumentExpiryDate } from '../../common/validators/is-document-expiry-date.validator';

export class CreateVehicleDocumentDto {
  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Vehicle registration in base64 (jpeg, png, webp — max 5MB)',
  })
  vehicleRegistration?: string;

  @IsBase64Image()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,...',
    description: 'Driving license in base64 (jpeg, png, webp — max 5MB)',
  })
  drivingLicense?: string;

  @IsDocumentExpiryDate('vehicleRegistration')
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the vehicle registration, required when the document is provided',
  })
  vehicleRegistrationExpiresAt?: string | null;

  @IsDocumentExpiryDate('drivingLicense')
  @ApiPropertyOptional({
    example: '2027-05-31',
    nullable: true,
    description:
      'Validity end date of the driving license, required when the document is provided',
  })
  drivingLicenseExpiresAt?: string | null;
}
