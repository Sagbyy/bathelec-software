import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSiteTeamDto {
  @ApiProperty({ example: 'Team 1', description: 'The name of the team' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Description of the team',
    description: 'The description of the team',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
