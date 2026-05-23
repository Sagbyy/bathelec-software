import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Role } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/request/create-market.dto';
import { UpdateMarketDto } from './dto/request/update-market.dto';

@ApiBearerAuth()
@ApiTags('markets')
@UseGuards(JwtAuthGuard)
@Controller('markets')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Role('admin')
  @UseGuards(RoleGuard)
  @Post()
  @ApiOperation({ summary: 'Create a market' })
  create(@Body(new ValidationPipe()) dto: CreateMarketDto) {
    return this.marketService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all markets' })
  findAll() {
    return this.marketService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a market by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(+id);
  }

  @Role('admin')
  @UseGuards(RoleGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a market' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() dto: UpdateMarketDto) {
    return this.marketService.update(+id, dto);
  }

  @Role('admin')
  @UseGuards(RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a market' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.marketService.remove(+id);
  }
}
