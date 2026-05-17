import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OfficialDocument,
  OfficialDocumentSchema,
} from './entities/official-document.entity';
import { OfficialDocumentsController } from './official-documents.controller';
import { OfficialDocumentsService } from './official-documents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OfficialDocument.name, schema: OfficialDocumentSchema },
    ]),
  ],
  controllers: [OfficialDocumentsController],
  providers: [OfficialDocumentsService],
})
export class OfficialDocumentsModule {}
