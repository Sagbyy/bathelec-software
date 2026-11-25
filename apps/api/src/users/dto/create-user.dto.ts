import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from './password-policy';

export class CreateUserDto {
  @ApiProperty({ example: 'jdupont' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Bathelec#2026' })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'jean.dupont@bathelec.fr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
