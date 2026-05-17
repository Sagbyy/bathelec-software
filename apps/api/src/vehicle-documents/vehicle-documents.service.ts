import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VehicleDocument,
  VehicleDocumentDocument,
} from './entities/vehicle-document.entity';
import { CreateVehicleDocumentDto } from './dto/create-vehicle-document.dto';
import { UpdateVehicleDocumentDto } from './dto/update-vehicle-document.dto';

@Injectable()
export class VehicleDocumentsService {
  constructor(
    @InjectModel(VehicleDocument.name)
    private vehicleDocumentModel: Model<VehicleDocumentDocument>
  ) {}

  async createOrUpdate(
    userId: number,
    createVehicleDocumentDto: CreateVehicleDocumentDto
  ): Promise<VehicleDocumentDocument> {
    const existing = await this.vehicleDocumentModel.findOne({ userId }).lean();

    if (existing) {
      return this.vehicleDocumentModel.findOneAndUpdate(
        { userId },
        { ...createVehicleDocumentDto, updatedAt: new Date() },
        { new: true }
      );
    }

    const vehicleDocument = new this.vehicleDocumentModel({
      ...createVehicleDocumentDto,
      userId,
    });
    return vehicleDocument.save();
  }

  async findByUserId(userId: number): Promise<VehicleDocumentDocument> {
    return this.vehicleDocumentModel.findOne({ userId });
  }

  async update(
    userId: number,
    updateVehicleDocumentDto: UpdateVehicleDocumentDto
  ): Promise<VehicleDocumentDocument> {
    return this.vehicleDocumentModel.findOneAndUpdate(
      { userId },
      { ...updateVehicleDocumentDto, updatedAt: new Date() },
      { new: true }
    );
  }

  async remove(userId: number): Promise<VehicleDocumentDocument> {
    return this.vehicleDocumentModel.findOneAndDelete({ userId });
  }
}
