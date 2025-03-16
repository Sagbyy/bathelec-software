import { Injectable } from '@nestjs/common';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivation.dto';
import { UpdateCompletedDerivationDto } from './dto/update-completed-derivation.dto';
import { CompletedDerivation } from './entities/completed-derivation.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CompletedDerivationService {
  constructor(
    @InjectModel(CompletedDerivation.name)
    private completedDerivationModel: Model<CompletedDerivation>
  ) {}

  async create(createCompletedDerivationDto: CreateCompletedDerivationDto) {
    const completedDerivation = new this.completedDerivationModel(
      createCompletedDerivationDto
    );
    return completedDerivation.save();
  }

  findAll() {
    return this.completedDerivationModel.find();
  }

  findOne(id: number) {
    return this.completedDerivationModel.findById(id);
  }

  update(
    id: number,
    updateCompletedDerivationDto: UpdateCompletedDerivationDto
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
