import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { Role } from 'src/role/role.decorator';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationsService } from './derivations.service';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { DerivationResponseDto } from './dto/response/derivation.response.dto';
import {
  GetDerivationByIdDto,
  GetDerivationByUserDto,
} from './dto/request/get-derivation.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('derivations')
export class DerivationsController {
  constructor(private readonly derivationsService: DerivationsService) {}

  @Role('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new derivation' })
  @ApiResponse({
    status: 201,
    description: 'The derivation has been successfully created.',
    type: DerivationResponseDto,
  })
  @ApiBody({ type: CreateDerivationDto })
  createDerivation(
    @Body(new ValidationPipe()) createDerivationDto: CreateDerivationDto
  ) {
    return this.derivationsService.createDerivation(createDerivationDto);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Find derivation by user id' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully retrieved.',
    type: [DerivationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: GetDerivationByUserDto })
  findDerivationByUserId(@Param('userId') userId: number) {
    return this.derivationsService.findDerivationByUserId(userId);
  }

  @Get('by-id/:derivationId')
  @ApiOperation({ summary: 'Find derivation by id' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully retrieved.',
    type: DerivationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: GetDerivationByIdDto })
  findDerivationById(@Param('derivationId') derivationId: number) {
    return this.derivationsService.findDerivationById(derivationId);
  }
}
