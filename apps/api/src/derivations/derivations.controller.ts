import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
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
import { UpdateDerivationDto } from './dto/request/update-derivation.dto';

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

  @Get()
  @ApiOperation({ summary: 'Find all derivations' })
  @ApiOkResponse({
    description: 'The derivations have been successfully retrieved.',
    type: [DerivationResponseDto],
  })
  findAllDerivations() {
    return this.derivationsService.findAllDerivations();
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

  @Patch('/:derivationId')
  @ApiOperation({ summary: 'Update a derivation' })
  @ApiParam({ name: 'derivationId', type: Number })
  @ApiOkResponse({
    description: 'The derivation has been successfully updated.',
    type: DerivationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The derivation has not been found.',
  })
  @ApiBody({ type: UpdateDerivationDto })
  updateDerivation(
    @Param('derivationId') derivationId: number,
    @Body() updateDerivationDto: UpdateDerivationDto
  ) {
    return this.derivationsService.updateDerivation(
      derivationId,
      updateDerivationDto
    );
  }
}
