import { PartialType } from '@nestjs/swagger';
import { CreateCompletedDerivationDto } from './create-completed-derivation.dto';

export class UpdateCompletedDerivationDto extends PartialType(CreateCompletedDerivationDto) {}
