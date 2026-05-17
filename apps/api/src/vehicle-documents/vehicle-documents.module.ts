import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VehicleDocument,
  VehicleDocumentSchema,
} from './entities/vehicle-document.entity';
import { VehicleDocumentsController } from './vehicle-documents.controller';
import { VehicleDocumentsService } from './vehicle-documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleDocument.name, schema: VehicleDocumentSchema },
    ]),
  ],
  controllers: [VehicleDocumentsController],
  providers: [VehicleDocumentsService],
})
export class VehicleDocumentsModule {}
