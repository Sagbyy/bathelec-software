import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../password-policy';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'BadPassword123',
    description: 'The current password',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: '@IW#Rf*#y7SW48',
    description: 'The new password',
  })
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
