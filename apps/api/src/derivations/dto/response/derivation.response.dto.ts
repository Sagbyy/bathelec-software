import { ApiProperty } from '@nestjs/swagger';
import { DerivationStatus } from '../../../types/derivations-status.enum';

export class DerivationResponseDto {
  @ApiProperty({ example: 1, description: 'The id of the derivation' })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the assigned user',
    nullable: true,
  })
  userId: number | null;

  @ApiProperty({
    example: 1,
    description: 'The id of the site team',
    nullable: true,
  })
  teamId: number | null;

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

  @ApiProperty({
    example: 0,
    description: 'Number of times the derivation was sent back for correction',
  })
  revisionCount: number;

  @ApiProperty({
    example: 'SGX001 - COM001 - ASC001 - 001 - 101',
    nullable: true,
    description: 'Folio entered on the report, unique business identifier',
  })
  folio: string | null;
}
