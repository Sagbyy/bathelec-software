import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompletedDerivationDto {
  @IsNotEmpty()
  @IsNumber()
  requestedDerivationId: number;
}
