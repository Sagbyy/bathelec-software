import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ClientInfoDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  folio: string;
}

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;
}

class GeneralInfoDto {
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @IsString()
  derivationBy: string;

  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  building: string;

  @IsString()
  cmIdentification: string;

  @IsString()
  floor: string;

  @IsString()
  situation: string;

  @IsString()
  comment: string;
}

class PhotoBeforeWorkDto {
  @IsString()
  photo: string;
}

class OldMeterDto {
  @IsString()
  type: string;

  @IsString()
  generation: string;

  @IsBoolean()
  preserved: boolean;

  @IsString()
  serialNumber: string;

  @IsString()
  key: string;

  @IsString()
  dayIndex: string;

  @IsString()
  nightIndex: string;
}

class NewDerivationDto {
  @IsString()
  section: string;

  @IsString()
  cableType: string;

  @IsNumber()
  length: number;
}

class NewMeterDto {
  @IsString()
  generation: string;

  @IsString()
  serialNumber: string;

  @IsString()
  dayIndex: string;

  @IsString()
  nightIndex: string;

  @IsOptional()
  @IsString()
  indexPhoto: string;
}

class CircuitBreakerDto {
  @IsBoolean()
  preserved: boolean;

  @IsString()
  voltage: string;

  @IsString()
  brand: string;

  @IsString()
  type: string;

  @IsString()
  power: string;

  @IsBoolean()
  commissioningDone: boolean;

  @IsBoolean()
  sealed: boolean;
}

class PhotoAfterWorkDto {
  @IsString()
  photo: string;
}

class ClientValidationDto {
  @IsBoolean()
  present: boolean;

  @IsBoolean()
  workValidation: boolean;

  @IsString()
  satisfactionLevel: string;

  @IsString()
  clientComment: string;

  @IsString()
  signature: string;

  @IsString()
  technicianComment: string;
}

export class CreateCompletedDerivationDto {
  @IsNumber()
  requestedDerivationId: number;

  @ValidateNested()
  @Type(() => ClientInfoDto)
  clientInfo: ClientInfoDto;

  @ValidateNested()
  @Type(() => GeneralInfoDto)
  generalInfo: GeneralInfoDto;

  @ValidateNested()
  @Type(() => PhotoBeforeWorkDto)
  photoBeforeWork: PhotoBeforeWorkDto;

  @ValidateNested()
  @Type(() => OldMeterDto)
  oldMeter: OldMeterDto;

  @ValidateNested()
  @Type(() => NewDerivationDto)
  newDerivation: NewDerivationDto;

  @ValidateNested()
  @Type(() => NewMeterDto)
  newMeter: NewMeterDto;

  @ValidateNested()
  @Type(() => CircuitBreakerDto)
  circuitBreaker: CircuitBreakerDto;

  @ValidateNested()
  @Type(() => PhotoAfterWorkDto)
  photoAfterWork: PhotoAfterWorkDto;

  @ValidateNested()
  @Type(() => ClientValidationDto)
  clientValidation: ClientValidationDto;
}
