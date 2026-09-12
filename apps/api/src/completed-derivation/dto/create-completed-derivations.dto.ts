import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class ClientInfoDto {
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'The name of the client' })
  name: string;

  @IsString()
  @ApiProperty({
    example: '06 06 06 06 06',
    description: 'The phone number of the client',
  })
  phone: string;

  @IsString()
  @ApiProperty({ example: '1234567890', description: 'The folio number' })
  folio: string;
}

class AddressDto {
  @IsString()
  @ApiProperty({
    example: '123 Main St',
    description: 'The street name',
  })
  street: string;

  @IsString()
  @ApiProperty({
    example: '12345',
    description: 'The postal code',
  })
  postalCode: string;

  @IsString()
  @ApiProperty({ example: 'Paris', description: 'The city' })
  city: string;
}

class GeneralInfoDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date and time of the derivation',
  })
  dateTime: Date;

  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the technician',
  })
  derivationBy: string;

  @Type(() => AddressDto)
  @ApiProperty({
    example: '123 Main St',
    description: 'The street name',
  })
  address: AddressDto;

  @IsString()
  @ApiProperty({
    example: 'Building',
    description: 'The building name',
  })
  building: string;

  @IsString()
  cmIdentification: string;

  @IsString()
  @ApiProperty({
    example: '1',
    description: 'The floor number',
  })
  floor: string;

  @IsString()
  situation: string;

  @IsString()
  @ApiProperty({
    example: 'This is a comment',
    description: 'The comment',
  })
  comment: string;
}

class PhotoBeforeWorkDto {
  @IsString()
  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'The photo before work',
  })
  photo: string;
}

class OldMeterDto {
  @IsString()
  @ApiProperty({
    example: 'Linky',
    description: 'The type of meter',
  })
  type: string;

  @IsString()
  @ApiProperty({
    example: 'G1',
    description: 'The generation of the meter',
  })
  generation: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The preserved',
  })
  preserved: boolean;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The serial number of the meter',
  })
  serialNumber: string;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The key of the meter',
  })
  key: string;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The day index of the meter',
  })
  dayIndex: string;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The night index of the meter',
  })
  nightIndex: string;
}

class NewDerivationDto {
  @IsString()
  @ApiProperty({
    example: '4 mm²',
    description: 'The section of the cable',
  })
  section: string;

  @IsString()
  @ApiProperty({
    example: 'Aluminium',
    description: 'The type of cable',
  })
  cableType: string;

  @IsNumber()
  @ApiProperty({
    example: 10,
    description: 'The length of the cable',
  })
  length: number;
}

class NewMeterDto {
  @IsString()
  @ApiProperty({
    example: 'G1',
    description: 'The generation of the meter',
  })
  generation: string;

  @IsString()
  @ApiProperty({
    example: '123456789012',
    description: 'The serial number of the meter (12 digits)',
  })
  serialNumber: string;

  @IsString()
  @ApiProperty({
    example: '34',
    description: 'The key of the meter (2 digits)',
  })
  key: string;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The day index of the meter',
  })
  dayIndex: string;

  @IsString()
  @ApiProperty({
    example: '1234567890',
    description: 'The night index of the meter',
  })
  nightIndex: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'The photo of the meter',
  })
  indexPhoto: string;
}

class CircuitBreakerDto {
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The preserved',
  })
  preserved: boolean;

  @IsString()
  @ApiProperty({
    example: 'Mono',
    description: 'The voltage',
  })
  voltage: string;

  @IsString()
  @ApiProperty({
    example: 'Schneider',
    description: 'The brand',
  })
  brand: string;

  @IsString()
  @ApiProperty({
    example: 'Sélectif',
    description: 'The type',
  })
  type: string;

  @IsString()
  @ApiProperty({
    example: '100A',
    description: 'The power',
  })
  power: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The commissioning done',
  })
  commissioningDone: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The sealed',
  })
  sealed: boolean;
}

class PhotoAfterWorkDto {
  @IsString()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The required photo after work',
  })
  photo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The second optional photo after work',
  })
  secondPhoto?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The third optional photo after work',
  })
  thirdPhoto?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The fourth optional photo after work',
  })
  fourthPhoto?: string;
}

class ClientValidationDto {
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The present',
  })
  present: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The work validation',
  })
  workValidation: boolean;

  @IsString()
  @ApiProperty({
    example: '2',
    description: 'The satisfaction level from 1 to 5',
  })
  satisfactionLevel: string;

  @IsString()
  @ApiProperty({
    example: 'Client comment',
    description: 'The client comment',
  })
  clientComment: string;

  @IsString()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The signature',
  })
  signature: string;

  @IsString()
  @ApiProperty({
    example: 'Technician comment',
    description: 'The technician comment',
  })
  technicianComment: string;
}

export class CreateCompletedDerivationDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The requested derivation id',
  })
  requestedDerivationId: number;

  @ValidateNested()
  @Type(() => ClientInfoDto)
  @ApiProperty({
    example: {
      name: 'John Doe',
      phone: '06 06 06 06 06',
      folio: '1234567890',
    },
  })
  clientInfo: ClientInfoDto;

  @ValidateNested()
  @Type(() => GeneralInfoDto)
  @ApiProperty({
    example: {
      dateTime: '2021-01-01T00:00:00.000Z',
      derivationBy: 'John Doe',
      address: '123 Main St',
      building: 'Building',
      cmIdentification: '1',
      floor: '1',
      situation: 'Situation',
      comment: 'Comment',
    },
  })
  generalInfo: GeneralInfoDto;

  @ValidateNested()
  @Type(() => PhotoBeforeWorkDto)
  @ApiProperty({
    example: {
      photo: 'https://example.com/photo.jpg',
    },
  })
  photoBeforeWork: PhotoBeforeWorkDto;

  @ValidateNested()
  @Type(() => OldMeterDto)
  @ApiProperty({
    example: {
      type: 'Linky',
      generation: 'G1',
      preserved: true,
      serialNumber: '1234567890',
      key: '1234567890',
      dayIndex: '1234567890',
      nightIndex: '1234567890',
    },
  })
  oldMeter: OldMeterDto;

  @ValidateNested()
  @Type(() => NewDerivationDto)
  @ApiProperty({
    example: {
      section: '4 mm²',
      cableType: 'Aluminium',
      length: 10,
    },
  })
  newDerivation: NewDerivationDto;

  @ValidateNested()
  @Type(() => NewMeterDto)
  @ApiProperty({
    example: {
      generation: 'G1',
      serialNumber: '1234567890',
      dayIndex: '1234567890',
      nightIndex: '1234567890',
      indexPhoto:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    },
  })
  newMeter: NewMeterDto;

  @ValidateNested()
  @Type(() => CircuitBreakerDto)
  @ApiProperty({
    example: {
      preserved: true,
      voltage: '230V',
      brand: 'Brand',
      power: 'Power',
      commissioningDone: true,
      sealed: true,
    },
  })
  circuitBreaker: CircuitBreakerDto;

  @ValidateNested()
  @Type(() => PhotoAfterWorkDto)
  @ApiProperty({
    example: {
      photo: 'https://example.com/photo.jpg',
    },
  })
  photoAfterWork: PhotoAfterWorkDto;

  @ValidateNested()
  @Type(() => ClientValidationDto)
  @ApiProperty({
    example: {
      present: true,
      workValidation: true,
      satisfactionLevel: 'Satisfaction level',
      clientComment: 'Client comment',
      signature:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
      technicianComment: 'Technician comment',
    },
  })
  clientValidation: ClientValidationDto;
}
