import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Habilitation,
  HabilitationDocument,
} from './entities/habilitation.entity';
import { UpdateHabilitationDto } from './dto/update-habilitation.dto';
import { UsersService } from '../users/users.service';

const DEFAULT_HABILITATIONS = {
  b0: false,
  bs: false,
  be: false,
  h0: false,
  h0v: false,
  b1: false,
  b1v: false,
  h1: false,
  h1v: false,
  b2: false,
  b2v: false,
  b2vEssais: false,
  h2: false,
  h2v: false,
  h2vEssais: false,
  bc: false,
  hc: false,
  br: false,
  beAttribut: false,
  heAttribut: false,
};

@Injectable()
export class HabilitationsService {
  constructor(
    @InjectModel(Habilitation.name)
    private readonly habilitationModel: Model<HabilitationDocument>,
    private readonly usersService: UsersService
  ) {}

  async findByUserId(
    userId: number
  ): Promise<
    HabilitationDocument | (typeof DEFAULT_HABILITATIONS & { userId: number })
  > {
    const doc = await this.habilitationModel.findOne({ userId });
    return doc ?? { userId, ...DEFAULT_HABILITATIONS };
  }

  async upsert(
    userId: number,
    dto: UpdateHabilitationDto
  ): Promise<HabilitationDocument> {
    const user = await this.usersService.findOneById(userId);
    if (!user || user.role !== 'technician') {
      throw new ForbiddenException(
        "Les habilitations ne peuvent être assignées qu'à un technicien."
      );
    }

    return this.habilitationModel.findOneAndUpdate(
      { userId },
      { $set: dto },
      { upsert: true, new: true }
    );
  }
}
