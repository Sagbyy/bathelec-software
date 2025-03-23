import { Injectable } from '@nestjs/common';
import {
  CompletedDerivation,
  CompletedDerivationDocument,
} from './entities/completed-derivations.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivations.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DerivationStatus } from '@repo/types';

@Injectable()
export class CompletedDerivationService {
  constructor(
    @InjectModel(CompletedDerivation.name)
    private completedDerivationModel: Model<CompletedDerivationDocument>,
    private readonly prisma: PrismaService
  ) {}

  async create(createCompletedDerivationDto: CreateCompletedDerivationDto) {
    try {
      const completedDerivationOnDatabase = await this.completedDerivationModel
        .findOne({
          requestedDerivationId:
            createCompletedDerivationDto.requestedDerivationId,
        })
        .lean();

      if (completedDerivationOnDatabase) {
        await this.prisma.derivation.update({
          where: {
            id: createCompletedDerivationDto.requestedDerivationId,
          },
          data: {
            status: DerivationStatus.COMPLETED,
          },
        });

        return this.completedDerivationModel.findOneAndUpdate(
          {
            requestedDerivationId:
              createCompletedDerivationDto.requestedDerivationId,
          },
          { ...createCompletedDerivationDto, updatedAt: new Date() },
          { new: true }
        );
      }

      const completedDerivation = new this.completedDerivationModel(
        createCompletedDerivationDto
      );

      await this.prisma.derivation.update({
        where: {
          id: createCompletedDerivationDto.requestedDerivationId,
        },
        data: {
          status: DerivationStatus.COMPLETED,
        },
      });

      return await completedDerivation.save();
    } catch (error) {
      console.error('Error in create method:', error);
      throw new Error('Error while creating or updating completed derivation');
    }
  }

  findAll() {
    return this.completedDerivationModel.find();
  }

  findOne(id: number) {
    return this.completedDerivationModel.findOne({
      requestedDerivationId: id,
    });
  }

  update(
    id: number,
    updateCompletedDerivationDto: Partial<CompletedDerivation>
  ) {
    return this.completedDerivationModel.findByIdAndUpdate(
      id,
      updateCompletedDerivationDto,
      { new: true }
    );
  }

  remove(id: number) {
    return this.completedDerivationModel.findByIdAndDelete(id);
  }
}
