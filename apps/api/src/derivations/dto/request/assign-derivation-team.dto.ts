import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignDerivationTeamDto {
  @ApiProperty({ example: 1, description: 'The id of the site team' })
  @IsInt()
  teamId: number;
}
