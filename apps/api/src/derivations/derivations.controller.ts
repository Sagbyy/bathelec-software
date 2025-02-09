import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { Role } from 'src/role/role.decorator';
import { CreateDerivationDto } from './dto/create-derivation.dto';
import { DerivationsService } from './derivations.service';

@UseGuards(JwtAuthGuard)
@Controller('derivations')
export class DerivationsController {
  constructor(private readonly derivationsService: DerivationsService) {}

  @Role('admin')
  @Post()
  createDerivation(
    @Body(new ValidationPipe()) createDerivationDto: CreateDerivationDto
  ) {
    return this.derivationsService.createDerivation(createDerivationDto);
  }

  @Get(':userId')
  findDerivationByUserId(@Param('userId') userId: number) {
    return this.derivationsService.findDerivationByUserId(userId);
  }
}
