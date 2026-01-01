import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUsersGroupDto {
  @ApiProperty({ example: 'Group 1', description: 'The name of the group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Description of the group',
    description: 'The description of the group',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
