import { ApiProperty } from '@nestjs/swagger';

export class ChantierResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '12 Rue de la Paix' })
  address: string;

  @ApiProperty({ example: 'AFF-ENEDIS-2024-001' })
  enedisAffaireNumber: string;

  @ApiProperty({ example: 'INT-2024-001' })
  internalAffaireNumber: string;

  @ApiProperty({ example: 1 })
  marketId: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
