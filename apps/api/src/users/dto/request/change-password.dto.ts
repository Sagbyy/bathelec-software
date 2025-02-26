import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'BadPassword123',
    description: 'The current password',
  })
  @IsString()
  @MinLength(2)
  currentPassword: string;

  @ApiProperty({
    example: '@IW#Rf*#y7SW48',
    description: 'The new password',
  })
  @IsString()
  @MinLength(2)
  newPassword: string;
}
