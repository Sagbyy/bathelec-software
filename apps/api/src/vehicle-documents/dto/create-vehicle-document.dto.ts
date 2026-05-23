import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

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
}
