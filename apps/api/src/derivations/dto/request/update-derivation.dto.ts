import { PartialType } from '@nestjs/swagger';
import { CreateDerivationDto } from './create-derivation.dto';

export class UpdateDerivationDto extends PartialType(CreateDerivationDto) {}
