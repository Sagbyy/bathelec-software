import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({
    example: 'Marché IDF 2024',
    description: 'The name of the market',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
