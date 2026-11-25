import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDocumentsController } from './vehicle-documents.controller';
import { VehicleDocumentsService } from './vehicle-documents.service';
import { OwnerOnlyGuard } from '../common/guards/owner-only.guard';
import { SelfAdminOrSupervisorGuard } from '../common/guards/self-admin-or-supervisor.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

const vehicleDocumentEntity = {
  userId: 1,
  vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
  drivingLicense: 'data:image/jpeg;base64,permisBase64',
};

const mockVehicleDocumentsService = {
  createOrUpdate: jest.fn().mockResolvedValue(vehicleDocumentEntity),
  findByUserId: jest.fn().mockResolvedValue(vehicleDocumentEntity),
  update: jest.fn().mockResolvedValue(vehicleDocumentEntity),
  remove: jest.fn().mockResolvedValue(vehicleDocumentEntity),
};

describe('VehicleDocumentsController', () => {
  let controller: VehicleDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleDocumentsController],
      providers: [
        {
          provide: VehicleDocumentsService,
          useValue: mockVehicleDocumentsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SelfAdminOrSupervisorGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(OwnerOnlyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VehicleDocumentsController>(
      VehicleDocumentsController
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('should delegate to service with userId from current user', async () => {
      const dto = {
        vehicleRegistration: 'data:image/jpeg;base64,vehicleRegistrationBase64',
      };
      mockVehicleDocumentsService.createOrUpdate.mockResolvedValue(
        vehicleDocumentEntity
      );

      const result = await controller.createOrUpdate(
        { userId: 1, username: 'test', role: 'technician' },
        dto
      );

      expect(result).toEqual(vehicleDocumentEntity);
      expect(mockVehicleDocumentsService.createOrUpdate).toHaveBeenCalledWith(
        1,
        dto
      );
    });
  });

  describe('findByUserId', () => {
    it('should return the vehicle document for a given userId', async () => {
      mockVehicleDocumentsService.findByUserId.mockResolvedValue(
        vehicleDocumentEntity
      );

      const result = await controller.findByUserId('1');

      expect(result).toEqual(vehicleDocumentEntity);
      expect(mockVehicleDocumentsService.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a vehicle document', async () => {
      const dto = { drivingLicense: 'data:image/jpeg;base64,newPermis' };
      const updated = { ...vehicleDocumentEntity, ...dto };
      mockVehicleDocumentsService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);

      expect(result).toEqual(updated);
      expect(mockVehicleDocumentsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete the vehicle document', async () => {
      mockVehicleDocumentsService.remove.mockResolvedValue(
        vehicleDocumentEntity
      );

      const result = await controller.remove('1');

      expect(result).toEqual(vehicleDocumentEntity);
      expect(mockVehicleDocumentsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('access control', () => {
    it('lets the owner, admins and supervisors read the documents', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        VehicleDocumentsController.prototype.findByUserId
      );
      expect(guards).toEqual([SelfAdminOrSupervisorGuard]);
    });

    it.each(['update', 'remove'] as const)(
      'restricts %s to the owning technician',
      (method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          VehicleDocumentsController.prototype[method]
        );
        expect(guards).toEqual([OwnerOnlyGuard]);
      }
    );
  });
});
