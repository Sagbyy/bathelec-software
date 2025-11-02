import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordInvalidDto {
  @ApiProperty({
    example: 400,
    description: 'The response status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Invalid password',
    description: 'The response message',
  })
  message: string;
}
