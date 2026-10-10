import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChantierDocument,
  ChantierDocumentSchema,
} from './entities/chantier-document.entity';
import { ChantierDocumentsController } from './chantier-documents.controller';
import { ChantierDocumentsService } from './chantier-documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChantierDocument.name, schema: ChantierDocumentSchema },
    ]),
  ],
  controllers: [ChantierDocumentsController],
  providers: [ChantierDocumentsService],
})
export class ChantierDocumentsModule {}
