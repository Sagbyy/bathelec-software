import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChantierDocumentsService } from './chantier-documents.service';
import { ChantierDocument } from './entities/chantier-document.entity';
import { ChantierDocumentType } from '@repo/types';

describe('ChantierDocumentsService', () => {
  let service: ChantierDocumentsService;
  let lastConstructed: Record<string, unknown>;

  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  function MockModel(this: Record<string, unknown>, doc: object) {
    Object.assign(this, doc);
    lastConstructed = this;
    this.save = jest.fn().mockResolvedValue(doc);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChantierDocumentsService,
        {
          provide: getModelToken(ChantierDocument.name),
          useValue: Object.assign(MockModel, mockModel),
        },
      ],
    }).compile();

    service = module.get<ChantierDocumentsService>(ChantierDocumentsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('derives mimeType and size from the data URL and stores ownership', async () => {
      await service.create(5, 10, {
        name: 'Étude',
        type: ChantierDocumentType.MARKET_STUDY,
        file: 'data:application/pdf;base64,QUJD',
      });

      expect(lastConstructed).toMatchObject({
        chantierId: 5,
        uploadedById: 10,
        name: 'Étude',
        type: ChantierDocumentType.MARKET_STUDY,
        mimeType: 'application/pdf',
        size: 3,
      });
    });

    it('throws when the file is not a valid data URL', async () => {
      await expect(
        service.create(5, 10, {
          name: 'Bad',
          type: ChantierDocumentType.OTHER,
          file: 'not-a-data-url',
        })
      ).rejects.toThrow('Invalid file format');
    });
  });

  describe('findByChantier', () => {
    it('returns documents of a chantier without the file payload', async () => {
      const select = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ name: 'Étude' }]),
      });
      mockModel.find.mockReturnValue({ select });

      const result = await service.findByChantier(5);

      expect(result).toEqual([{ name: 'Étude' }]);
      expect(mockModel.find).toHaveBeenCalledWith({ chantierId: 5 });
      expect(select).toHaveBeenCalledWith('-file');
    });
  });

  describe('findOne', () => {
    it('returns a single document with its file', async () => {
      mockModel.findById.mockResolvedValue({ name: 'Étude', file: 'data:...' });

      const result = await service.findOne('abc');

      expect(result).toEqual({ name: 'Étude', file: 'data:...' });
      expect(mockModel.findById).toHaveBeenCalledWith('abc');
    });
  });

  describe('remove', () => {
    it('deletes a document by id', async () => {
      mockModel.findByIdAndDelete.mockResolvedValue({ name: 'Étude' });

      const result = await service.remove('abc');

      expect(result).toEqual({ name: 'Étude' });
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('abc');
    });
  });
});
