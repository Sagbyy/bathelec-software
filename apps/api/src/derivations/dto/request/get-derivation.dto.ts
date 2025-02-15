import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetDerivationByUserDto {
  @ApiProperty({ example: 1, description: 'The id of the user' })
  @IsNumber()
  userId: number;
}

export class GetDerivationByIdDto {
  @ApiProperty({ example: 1, description: 'The id of the derivation' })
  @IsNumber()
  derivationId: number;
}
