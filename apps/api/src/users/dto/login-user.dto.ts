import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'jdupont' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Bathelec#2026' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
