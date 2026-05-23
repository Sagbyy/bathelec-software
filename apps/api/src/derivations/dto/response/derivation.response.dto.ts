import { ApiProperty } from '@nestjs/swagger';
import { DerivationStatus } from '../../../types/derivations-status.enum';

export class DerivationResponseDto {
  @ApiProperty({ example: 1, description: 'The id of the derivation' })
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the chantier',
    nullable: true,
  })
  chantierId: number | null;

  @ApiProperty({
    example: '2024-10-17T21:35:46.564Z',
    description: 'The creation date',
  })
  createdAt: string;

  @ApiProperty({
    example: 'Pending',
    description: 'The status of the derivation',
  })
  status: DerivationStatus;

  @ApiProperty({ example: null, nullable: true })
  correctionComment: string | null;
}
