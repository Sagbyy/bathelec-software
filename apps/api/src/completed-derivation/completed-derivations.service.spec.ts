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
});
