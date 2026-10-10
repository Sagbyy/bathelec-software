import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { Role, ROLE_VALUES } from '@repo/types';

export class UpdateUserDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'The username of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: Role.ADMIN,
    enum: Role,
    description: 'The role of the user',
    required: false,
  })
  @IsIn(ROLE_VALUES)
  @IsOptional()
  role?: Role;
}
