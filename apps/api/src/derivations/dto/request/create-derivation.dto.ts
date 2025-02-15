import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateDerivationDto {
  @ApiProperty({ example: 1, description: 'The id of the user' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '3 Rue Paul Jean Jacque',
    description: 'The address',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({ example: 93370, description: 'The postal code' })
  @IsNumber()
  postalCode: number;

  @ApiProperty({ example: 'Montfermeil', description: 'The city' })
  @IsString()
  @MinLength(2)
  city: string;
}
