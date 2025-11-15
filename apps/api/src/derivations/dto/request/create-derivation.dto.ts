import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateDerivationDto {
  @ApiProperty({ example: 1, description: 'The id of the user' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: false,
    description: 'If true, creates a blank derivation without address',
  })
  @IsBoolean()
  isBlank: boolean;

  @ApiProperty({
    example: '3 Rue Paul Jean Jacque',
    description: 'The address',
  })
  @ValidateIf((o) => !o.isBlank)
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({ example: 93370, description: 'The postal code' })
  @ValidateIf((o) => !o.isBlank)
  @IsNumber()
  postalCode: number;

  @ApiProperty({ example: 'Montfermeil', description: 'The city' })
  @ValidateIf((o) => !o.isBlank)
  @IsString()
  @MinLength(2)
  city: string;
}
