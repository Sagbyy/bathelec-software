import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateIf } from 'class-validator';

export class AssignDerivationUserDto {
  @ApiProperty({
    example: 1,
    description: 'The id of a team member, or null to unassign',
    nullable: true,
    type: Number,
  })
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  userId: number | null;
}
