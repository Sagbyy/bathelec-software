import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompletedDerivationService } from './completed-derivations.service';
import { CompletedDerivation } from './entities/completed-derivations.entity';
import { PrismaService } from '../prisma/prisma.service';

const mockDto = {
  requestedDerivationId: 1,
  clientInfo: { name: 'John Doe', phone: '1234567890', folio: '1234567890' },
  generalInfo: {
    dateTime: new Date(),
    derivationBy: 'John Doe',
    address: { street: '123 Main St', postalCode: '12345', city: 'Anytown' },
    building: '123 Main St',
    cmIdentification: '1234567890',
    floor: '1',
    situation: '1',
    comment: '1',
  },
  photoBeforeWork: { photo: '1234567890' },
  oldMeter: {
    type: '1',
    generation: '1',
    preserved: true,
    serialNumber: '1234567890',
    key: '1',
    dayIndex: '1',
    nightIndex: '1',
  },
  newDerivation: { section: '1', cableType: '1', length: 1 },
  newMeter: {
    generation: '1',
    serialNumber: '1234567890',
    key: '1',
    dayIndex: '1',
    nightIndex: '1',
    indexPhoto: '1234567890',
  },
  circuitBreaker: {
    preserved: true,
    voltage: '1',
    brand: '1',
    type: '1',
    power: '1',
    calibrationPower: '1',
    commissioningDone: true,
    sealed: true,
  },
  photoAfterWork: { photo: '1234567890' },
  clientValidation: {
    present: true,
    workValidation: true,
    satisfactionLevel: '1',
    clientComment: '1',
    signature: '1234567890',
    technicianComment: '1',

    technicianSignature: 'data:image/png;base64,signature',
  },
};

describe('CompletedDerivationService', () => {
  let service: CompletedDerivationService;

  const mockCompletedDerivationModel = {
    findOne: jest
      .fn()
      .mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }),
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  };

  function MockCompletedDerivationModel(dto: object) {
    Object.assign(this, dto);
    this.save = jest.fn().mockResolvedValue({ ...dto });
  }

  const mockPrismaService = {
    derivation: {
      update: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompletedDerivationService,
        {
          provide: getModelToken(CompletedDerivation.name),
          useValue: Object.assign(
            MockCompletedDerivationModel,
            mockCompletedDerivationModel
          ),
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompletedDerivationService>(
      CompletedDerivationService
    );
    jest.clearAllMocks();
    mockCompletedDerivationModel.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    mockPrismaService.derivation.update.mockResolvedValue({});
    mockPrismaService.derivation.findFirst.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a completed derivation', async () => {
    const completedDerivation = await service.create(mockDto);

    expect(completedDerivation).toBeDefined();
    expect(completedDerivation.clientInfo).toEqual(mockDto.clientInfo);
    expect(completedDerivation.generalInfo).toMatchObject(mockDto.generalInfo);
    expect(completedDerivation.photoBeforeWork).toEqual(
      mockDto.photoBeforeWork
    );
    expect(completedDerivation.oldMeter).toEqual(mockDto.oldMeter);
    expect(completedDerivation.newDerivation).toEqual(mockDto.newDerivation);
    expect(completedDerivation.newMeter).toEqual(mockDto.newMeter);
    expect(completedDerivation.circuitBreaker).toEqual(mockDto.circuitBreaker);
    expect(completedDerivation.photoAfterWork).toEqual(mockDto.photoAfterWork);
    expect(completedDerivation.clientValidation).toEqual(
      mockDto.clientValidation
    );
  });

  describe('folio, identifiant de la dérivation (DTA-63)', () => {
    const withFolio = (folio: string) => ({
      ...mockDto,
      clientInfo: { ...mockDto.clientInfo, folio },
    });

    it('normalise le folio et le recopie sur la dérivation', async () => {
      const result = await service.create(
        withFolio('sgx001-com001 -asc001-  001 - 101')
      );

      expect(result.clientInfo.folio).toBe(
        'SGX001 - COM001 - ASC001 - 001 - 101'
      );
      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith({
        where: { id: mockDto.requestedDerivationId },
        data: {
          status: 'Reviewing',
          folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
        },
      });
    });

    it('refuse un folio déjà utilisé par une autre dérivation', async () => {
      mockPrismaService.derivation.findFirst.mockResolvedValue({ id: 7 });

      await expect(
        service.create(withFolio('SGX001 - COM001 - ASC001 - 001 - 101'))
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create(withFolio('SGX001 - COM001 - ASC001 - 001 - 101'))
      ).rejects.toThrow('Ce folio est déjà utilisé par la dérivation n°7');
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it('ignore la dérivation elle-même lors du contrôle d’unicité', async () => {
      await service.create(withFolio('SGX001 - COM001 - ASC001 - 001 - 101'));

      expect(mockPrismaService.derivation.findFirst).toHaveBeenCalledWith({
        where: {
          folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
          NOT: { id: mockDto.requestedDerivationId },
        },
        select: { id: true },
      });
    });
  });
});
