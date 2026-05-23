import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VehicleDocumentsService } from './vehicle-documents.service';
import { VehicleDocument } from './entities/vehicle-document.entity';

const mockVehicleDocument = {
  userId: 1,
  vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
  drivingLicense: 'data:image/jpeg;base64,permisBase64',
};

const mockDto = {
  vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
  drivingLicense: 'data:image/jpeg;base64,permisBase64',
};

describe('VehicleDocumentsService', () => {
  let service: VehicleDocumentsService;

  const mockVehicleDocumentModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    save: jest.fn(),
  };

  function MockVehicleDocumentModel(dto: object) {
    Object.assign(this, dto);
    this.save = jest.fn().mockResolvedValue({ ...dto });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleDocumentsService,
        {
          provide: getModelToken(VehicleDocument.name),
          useValue: Object.assign(
            MockVehicleDocumentModel,
            mockVehicleDocumentModel
          ),
        },
      ],
    }).compile();

    service = module.get<VehicleDocumentsService>(VehicleDocumentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('should create a new vehicle document when none exists', async () => {
      mockVehicleDocumentModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await service.createOrUpdate(1, mockDto);

      expect(result).toEqual({ ...mockDto, userId: 1 });
      expect(mockVehicleDocumentModel.findOne).toHaveBeenCalledWith({
        userId: 1,
      });
    });

    it('should update an existing vehicle document when one exists', async () => {
      mockVehicleDocumentModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockVehicleDocument),
      });
      const updatedDto = {
        vehicleRegistration: 'data:image/jpeg;base64,newCarteGriseBase64',
      };
      mockVehicleDocumentModel.findOneAndUpdate.mockResolvedValue({
        ...mockVehicleDocument,
        ...updatedDto,
      });

      const result = await service.createOrUpdate(1, updatedDto);

      expect(result.vehicleRegistration).toBe(
        'data:image/jpeg;base64,newCarteGriseBase64'
      );
      expect(mockVehicleDocumentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        expect.objectContaining(updatedDto),
        { new: true }
      );
    });
  });

  describe('findByUserId', () => {
    it('should return the vehicle document for a given userId', async () => {
      mockVehicleDocumentModel.findOne.mockResolvedValue(mockVehicleDocument);

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockVehicleDocument);
      expect(mockVehicleDocumentModel.findOne).toHaveBeenCalledWith({
        userId: 1,
      });
    });

    it('should return null when no document exists for the userId', async () => {
      mockVehicleDocumentModel.findOne.mockResolvedValue(null);

      const result = await service.findByUserId(99);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a vehicle document by userId', async () => {
      const updated = {
        ...mockVehicleDocument,
        drivingLicense: 'data:image/jpeg;base64,newPermisBase64',
      };
      mockVehicleDocumentModel.findOneAndUpdate.mockResolvedValue(updated);

      const result = await service.update(1, {
        drivingLicense: 'data:image/jpeg;base64,newPermisBase64',
      });

      expect(result.drivingLicense).toBe(
        'data:image/jpeg;base64,newPermisBase64'
      );
      expect(mockVehicleDocumentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 1 },
        expect.objectContaining({
          drivingLicense: 'data:image/jpeg;base64,newPermisBase64',
        }),
        { new: true }
      );
    });
  });

  describe('remove', () => {
    it('should delete the vehicle document for a given userId', async () => {
      mockVehicleDocumentModel.findOneAndDelete.mockResolvedValue(
        mockVehicleDocument
      );

      const result = await service.remove(1);

      expect(result).toEqual(mockVehicleDocument);
      expect(mockVehicleDocumentModel.findOneAndDelete).toHaveBeenCalledWith({
        userId: 1,
      });
    });

    it('should return null when no document exists for the userId', async () => {
      mockVehicleDocumentModel.findOneAndDelete.mockResolvedValue(null);

      const result = await service.remove(99);

      expect(result).toBeNull();
    });
  });
});
