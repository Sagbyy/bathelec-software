import {
  Equals,
  IsBoolean,
  IsDate,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  FOLIO_PATTERN,
  isNewMeterInstalled,
  REPORT_MAX_ADDITIONAL_PHOTOS,
} from '@repo/types';
import { IsReportPhoto } from './is-report-photo.validator';

const SATISFACTION_LEVELS = ['0', '1', '2', '3', '4'];
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
  @Matches(FOLIO_PATTERN, {
    message:
      'folio must contain 5 alphanumeric segments separated by dashes (e.g. SGX001 - COM001 - ASC001 - 001 - 101)',
  })
  @ApiProperty({
    example: 'SGX001 - COM001 - ASC001 - 001 - 101',
    description: 'The folio, unique business identifier of the derivation',
  })
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
  @IsReportPhoto()
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

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: false,
    required: false,
    description:
      'The client refused the Linky meter: no new meter is installed',
  })
  linkyRefusal?: boolean;

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

  @ValidateIf(
    (meter: OldMeterDto) => !meter.preserved || meter.indexPhoto != null
  )
  @IsReportPhoto()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    required: false,
    description:
      'The photo of the old meter index, required unless the meter is preserved',
  })
  indexPhoto?: string;
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

  @IsReportPhoto()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    description: 'The photo of the new meter with a visible index',
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
    example: '15-45',
    description: 'The circuit breaker power (calibre)',
  })
  power: string;

  @IsString()
  @ApiProperty({
    example: '45A',
    description: 'The calibration power (réglage)',
  })
  calibrationPower: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The commissioning done',
  })
  commissioningDone: boolean;

  @Equals(true, { message: 'The circuit breaker must be sealed' })
  @ApiProperty({
    example: true,
    description: 'The circuit breaker sealing, mandatory in every case',
  })
  sealed: boolean;

  @ValidateIf(
    (breaker: CircuitBreakerDto) =>
      breaker.preserved || breaker.testButton != null
  )
  @IsIn(['working', 'faulty'])
  @ApiProperty({
    example: 'working',
    enum: ['working', 'faulty'],
    required: false,
    nullable: true,
    description:
      'Result of the TEST button check after commissioning, required when the breaker is preserved',
  })
  testButton?: 'working' | 'faulty' | null;

  @ValidateIf((breaker: CircuitBreakerDto) => breaker.testButton === 'faulty')
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Bouton test inopérant, disjoncteur à remplacer',
    required: false,
    description:
      'Explanation required when the TEST button is faulty and the breaker must be replaced',
  })
  replacementExplanation?: string;
}

class PhotoAfterWorkDto {
  @IsReportPhoto()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    description: 'The required photo after work',
  })
  photo: string;

  @IsOptional()
  @IsReportPhoto()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    required: false,
    description: 'The first optional additional photo after work',
  })
  secondPhoto?: string;

  @IsOptional()
  @IsReportPhoto()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    required: false,
    description: 'The second optional additional photo after work',
  })
  thirdPhoto?: string;

  @IsEmpty({
    message: `At most ${REPORT_MAX_ADDITIONAL_PHOTOS} additional photos are allowed`,
  })
  fourthPhoto?: never;
}

class ClientValidationDto {
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The present',
  })
  present: boolean;

  @ValidateIf((validation: ClientValidationDto) => validation.present)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    description: 'The work validation, required when the client is present',
  })
  workValidation?: boolean;

  @ValidateIf((validation: ClientValidationDto) => validation.present)
  @IsIn(SATISFACTION_LEVELS)
  @ApiProperty({
    example: '2',
    required: false,
    enum: SATISFACTION_LEVELS,
    description:
      'The satisfaction level from 0 to 4, required when the client is present',
  })
  satisfactionLevel?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Client comment',
    required: false,
    description: 'The client comment',
  })
  clientComment?: string;

  @ValidateIf((validation: ClientValidationDto) => validation.present)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    required: false,
    nullable: true,
    description:
      'The client signature, required only when the client is present',
  })
  signature?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    required: false,
    description:
      'RAS toggle: the technician has nothing to report, the comment becomes optional',
  })
  technicianNothingToReport?: boolean;

  @IsString()
  @ValidateIf(
    (validation: ClientValidationDto) => !validation.technicianNothingToReport
  )
  @IsNotEmpty()
  @ApiProperty({
    example: 'Technician comment',
    description:
      'The technician comment, required unless the RAS toggle is enabled',
  })
  technicianComment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    description: 'The technician signature',
  })
  technicianSignature: string;
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
      folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
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

  @ValidateIf((dto: CreateCompletedDerivationDto) =>
    isNewMeterInstalled(dto.oldMeter ?? {})
  )
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
