export { officialDocumentService } from './api/official-document.service';
export {
  useOfficialDocument,
  useUpsertOfficialDocument,
} from './model/use-official-document';
export type {
  OfficialDocument,
  OfficialDocumentKey,
  CreateOfficialDocumentDto,
} from './model/official-document.types';
export {
  OFFICIAL_DOCUMENT_FIELDS,
  OFFICIAL_DOCUMENT_KEYS,
} from './config/official-document-fields';
