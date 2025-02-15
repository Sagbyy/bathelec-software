import { ApiProperty } from '@nestjs/swagger';
import { DerivationStatus } from '@repo/types';

export class DerivationResponseDto {
  @ApiProperty({ example: 1, description: 'The id of the derivation' })
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user' })
  userId: number;

  @ApiProperty({
    example: '2024-10-17T21:35:46.564Z',
    description: 'The creation date',
  })
  createdAt: string;

  @ApiProperty({
    example: '3 Rue Paul Jean Jacque',
    description: 'The address',
  })
  address: string;

  @ApiProperty({ example: 'Montfermeil', description: 'The city' })
  city: string;

  @ApiProperty({ example: '93370', description: 'The postal code' })
  postalCode: string;

  @ApiProperty({
    example: 'Pending',
    description: 'The status of the derivation',
  })
  status: DerivationStatus;
}
