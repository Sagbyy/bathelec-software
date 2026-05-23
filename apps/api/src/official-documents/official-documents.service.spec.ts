import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OfficialDocumentsService } from './official-documents.service';
import { OfficialDocument } from './entities/official-document.entity';

const mockDocument = {
  userId: 1,
  idCard: 'data:image/jpeg;base64,idCardBase64',
  btpCard: 'data:image/jpeg;base64,btpCardBase64',
  mutualCard: 'data:image/jpeg;base64,mutualCardBase64',
};

const mockDto = {
  idCard: 'data:image/jpeg;base64,idCardBase64',
  btpCard: 'data:image/jpeg;base64,btpCardBase64',
  mutualCard: 'data:image/jpeg;base64,mutualCardBase64',
};

describe('OfficialDocumentsService', () => {
  let service: OfficialDocumentsService;

  const mockModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  function MockModel(dto: object) {
    Object.assign(this, dto);
    this.save = jest.fn().mockResolvedValue({ ...dto });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficialDocumentsService,
        {
          provide: getModelToken(OfficialDocument.name),
          useValue: Object.assign(MockModel, mockModel),
        },
      ],
    }).compile();

    service = module.get<OfficialDocumentsService>(OfficialDocumentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('crée un nouveau document quand aucun n\'existe', async () => {
      mockModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

      const result = await service.createOrUpdate(1, mockDto);

      expect(result).toEqual({ ...mockDto, userId: 1 });
      expect(mockModel.findOne).toHaveBeenCalledWith({ userId: 1 });
    });

    it('met à jour le document existant', async () => {
      mockModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDocument),
      });
      const updatedDto = { idCard: 'data:image/jpeg;base64,nouveau' };
      mockModel.findOneAndUpdate.mockResolvedValue({
        ...mockDocument,
        ...updatedDto,
      });

      const result = await service.createOrUpdate(1, updatedDto);

      expect(result.idCard).toBe('data:image/jpeg;base64,nouveau');
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        expect.objectContaining(updatedDto),
        { new: true }
      );
    });

    it('crée uniquement avec pièce d\'identité (autres champs absents)', async () => {
      mockModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

      const result = await service.createOrUpdate(1, {
        idCard: 'data:image/jpeg;base64,idCardBase64',
      });

      expect(result).toMatchObject({
        userId: 1,
        idCard: 'data:image/jpeg;base64,idCardBase64',
      });
    });
  });

  describe('findByUserId', () => {
    it('retourne le document pour un userId donné', async () => {
      mockModel.findOne.mockResolvedValue(mockDocument);

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockDocument);
      expect(mockModel.findOne).toHaveBeenCalledWith({ userId: 1 });
    });

    it('retourne null si aucun document n\'existe', async () => {
      mockModel.findOne.mockResolvedValue(null);

      const result = await service.findByUserId(99);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('met à jour la carte mutuelle par userId', async () => {
      const updated = {
        ...mockDocument,
        mutualCard: 'data:image/jpeg;base64,nouvelleMutuelle',
      };
      mockModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.update(1, {
        mutualCard: 'data:image/jpeg;base64,nouvelleMutuelle',
      });

      expect(result.mutualCard).toBe('data:image/jpeg;base64,nouvelleMutuelle');
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        expect.objectContaining({
          mutualCard: 'data:image/jpeg;base64,nouvelleMutuelle',
        }),
        { new: true }
      );
    });

    it('met à jour la carte pro BTP par userId', async () => {
      const updated = {
        ...mockDocument,
        btpCard: 'data:image/jpeg;base64,nouvelleCartePro',
      };
      mockModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.update(1, {
        btpCard: 'data:image/jpeg;base64,nouvelleCartePro',
      });

      expect(result.btpCard).toBe('data:image/jpeg;base64,nouvelleCartePro');
    });
  });

  describe('remove', () => {
    it('supprime le document pour un userId donné', async () => {
      mockModel.findOneAndDelete.mockResolvedValue(mockDocument);

      const result = await service.remove(1);

      expect(result).toEqual(mockDocument);
      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ userId: 1 });
    });

    it('retourne null si aucun document n\'existait', async () => {
      mockModel.findOneAndDelete.mockResolvedValue(null);

      const result = await service.remove(99);

      expect(result).toBeNull();
    });
  });
});
