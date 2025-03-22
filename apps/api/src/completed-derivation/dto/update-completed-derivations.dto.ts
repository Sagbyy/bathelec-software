import { PartialType } from '@nestjs/swagger';
import { CreateCompletedDerivationDto } from './create-completed-derivations.dto';

export class UpdateCompletedDerivationDto extends PartialType(
  CreateCompletedDerivationDto
) {}
