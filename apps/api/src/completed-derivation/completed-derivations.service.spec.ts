import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompletedDerivationService } from './completed-derivations.service';
import { CompletedDerivation } from './entities/completed-derivations.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@repo/types';
import { DerivationAccessService } from '../derivations/access/derivation-access.service';

const technician = { userId: 42, username: 'tech', role: Role.TECHNICIAN };
const assignedDerivation = { id: 1, userId: 42, teamId: 3, status: 'Pending' };

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

  const mockDerivationAccess = {
    findFillableOrThrow: jest.fn(),
    findViewableOrThrow: jest.fn(),
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
        { provide: DerivationAccessService, useValue: mockDerivationAccess },
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
    mockDerivationAccess.findFillableOrThrow.mockResolvedValue(
      assignedDerivation
    );
    mockDerivationAccess.findViewableOrThrow.mockResolvedValue(
      assignedDerivation
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a completed derivation', async () => {
    const completedDerivation = await service.create(mockDto, technician);

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
        withFolio('sgx001-com001 -asc001-  001 - 101'),
        technician
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
        service.create(
          withFolio('SGX001 - COM001 - ASC001 - 001 - 101'),
          technician
        )
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create(
          withFolio('SGX001 - COM001 - ASC001 - 001 - 101'),
          technician
        )
      ).rejects.toThrow('Ce folio est déjà utilisé par la dérivation n°7');
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it('ignore la dérivation elle-même lors du contrôle d’unicité', async () => {
      await service.create(
        withFolio('SGX001 - COM001 - ASC001 - 001 - 101'),
        technician
      );

      expect(mockPrismaService.derivation.findFirst).toHaveBeenCalledWith({
        where: {
          folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
          NOT: { id: mockDto.requestedDerivationId },
        },
        select: { id: true },
      });
    });
  });

  describe('contrôle d’accès au relevé (RG-04, ENF-03)', () => {
    it('refuse la soumission quand la dérivation n’est plus modifiable', async () => {
      mockDerivationAccess.findFillableOrThrow.mockRejectedValue(
        new ConflictException()
      );

      await expect(service.create(mockDto, technician)).rejects.toThrow(
        ConflictException
      );
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
    });

    it('vérifie le droit de saisie de l’acteur sur la dérivation demandée', async () => {
      await service.create(mockDto, technician);

      expect(mockDerivationAccess.findFillableOrThrow).toHaveBeenCalledWith(
        mockDto.requestedDerivationId,
        technician
      );
    });

    it('attribue au technicien une dérivation d’équipe non attribuée', async () => {
      mockDerivationAccess.findFillableOrThrow.mockResolvedValue({
        ...assignedDerivation,
        userId: null,
      });

      await service.create(mockDto, technician);

      expect(mockPrismaService.derivation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: technician.userId }),
        })
      );
    });

    it('ne réattribue pas une dérivation déjà attribuée', async () => {
      await service.create(mockDto, technician);

      const { data } = mockPrismaService.derivation.update.mock.calls[0][0];
      expect(data.userId).toBeUndefined();
    });

    it('ne lit le relevé qu’après avoir vérifié le droit de consultation', async () => {
      mockDerivationAccess.findViewableOrThrow.mockRejectedValue(
        new ForbiddenException()
      );

      await expect(service.findOne(1, technician)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockCompletedDerivationModel.findOne).not.toHaveBeenCalled();
    });
  });
  describe('rejeu idempotent d’une soumission hors-ligne (ENF-08)', () => {
    const submissionId = '3f0c8a52-6a0e-4d3c-9f8e-2b1d5c7e9a10';
    const replayedDto = { ...mockDto, clientSubmissionId: submissionId };
    const storedReport = { ...replayedDto, _id: 'stored' };

    const findOneResolving = (report: unknown) =>
      mockCompletedDerivationModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(report),
      });

    it('renvoie le relevé déjà enregistré sans le soumettre une seconde fois', async () => {
      findOneResolving(storedReport);

      const result = await service.create(replayedDto, technician);

      expect(result).toBe(storedReport);
      expect(mockCompletedDerivationModel.findOne).toHaveBeenCalledWith({
        requestedDerivationId: mockDto.requestedDerivationId,
        clientSubmissionId: submissionId,
      });
      expect(mockDerivationAccess.findFillableOrThrow).not.toHaveBeenCalled();
      expect(mockPrismaService.derivation.update).not.toHaveBeenCalled();
      expect(
        mockCompletedDerivationModel.findOneAndUpdate
      ).not.toHaveBeenCalled();
    });

    it('vérifie le droit de consultation avant de renvoyer le relevé rejoué', async () => {
      findOneResolving(storedReport);
      mockDerivationAccess.findViewableOrThrow.mockRejectedValue(
        new ForbiddenException()
      );

      await expect(service.create(replayedDto, technician)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('enregistre l’identifiant de soumission lors de la première réception', async () => {
      const result = await service.create(replayedDto, technician);

      expect(mockDerivationAccess.findFillableOrThrow).toHaveBeenCalled();
      expect(mockPrismaService.derivation.update).toHaveBeenCalled();
      expect(result.clientSubmissionId).toBe(submissionId);
    });

    it('ne cherche pas de rejeu sans identifiant de soumission', async () => {
      await service.create(mockDto, technician);

      expect(mockCompletedDerivationModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockCompletedDerivationModel.findOne).toHaveBeenCalledWith({
        requestedDerivationId: mockDto.requestedDerivationId,
      });
    });
  });
});
