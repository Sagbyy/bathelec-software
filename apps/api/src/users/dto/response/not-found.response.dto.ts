import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
  @ApiProperty({
    example: 404,
    description: 'The response status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'User not found',
    description: 'The response message',
  })
  message: string;
}
