import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateDerivationDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(5)
  address: string;

  @IsNumber()
  postalCode: number;

  @IsString()
  @MinLength(2)
  city: string;
}
