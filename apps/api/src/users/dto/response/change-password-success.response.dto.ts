import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseSuccessDto {
  @ApiProperty({
    example: 200,
    description: 'The response status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Password changed successfully',
    description: 'The response message',
  })
  message: string;
}
