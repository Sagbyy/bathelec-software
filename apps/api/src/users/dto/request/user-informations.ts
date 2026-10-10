import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Role, ROLE_VALUES } from '@repo/types';

export class UserInformationsDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: Role.ADMIN,
    enum: Role,
    description: 'The role of the user',
  })
  @IsIn(ROLE_VALUES)
  role: Role;

  @ApiProperty({
    example: '2021-01-01',
    description: 'The creation date of the user',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
