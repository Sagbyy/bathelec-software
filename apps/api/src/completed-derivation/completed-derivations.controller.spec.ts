import { Test, TestingModule } from '@nestjs/testing';
import { CompletedDerivationController } from './completed-derivations.controller';
import { CompletedDerivationService } from './completed-derivations.service';

describe('CompletedDerivationController', () => {
  let controller: CompletedDerivationController;

  const completedDerivationEntity = {
    requestedDerivationId: 1,
    clientInfo: {
      name: 'Mohamed',
      phone: '06 06 06 06 06',
      folio: '1234567890',
    },
    generalInfo: {
      dateTime: new Date('2025-03-22T22:35:00.622Z'),
      derivationBy: '71',
      address: {
        street: 'Street 12, London',
        postalCode: ' ',
        city: 'London',
      },
      building: 'Building 12',
      cmIdentification: '1234567890',
      floor: '1',
      situation: 'Situation 1',
      comment: 'Comment 1',
    },
    photoBeforeWork: {
      photo: 'photo',
    },
    oldMeter: {
      type: 'linky',
      generation: 'g1',
      preserved: false,
      serialNumber: '1234567890',
      key: '1234567890',
      dayIndex: '1234567890',
      nightIndex: '1234567890',
      indexPhoto: 'photo',
    },
    newDerivation: {
      section: 'section 1',
      cableType: 'cable type 1',
      length: 100,
    },
    newMeter: {
      generation: 'g1',
      serialNumber: '1234567890',
      dayIndex: '1234567890',
      nightIndex: '1234567890',
      indexPhoto: 'photo',
    },
    circuitBreaker: {
      preserved: false,
      voltage: '230',
      brand: 'brand 1',
      type: 'type 1',
      power: '1000',
      commissioningDone: false,
      sealed: false,
    },
    photoAfterWork: {
      photo: 'photo',
    },
    clientValidation: {
      present: true,
      workValidation: false,
      satisfactionLevel: '0',
      clientComment: 'Comment 1',
      signature: 'signature',
      technicianComment: 'Comment 1',
    },
  };

  const mockCompletedDerivationService = {
    findAll: async () => [],
    findOne: async () => ({}),
    create: async () => completedDerivationEntity,
    update: async () => ({}),
    delete: async () => ({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedDerivationController],
      providers: [
        {
          provide: CompletedDerivationService,
          useValue: mockCompletedDerivationService,
        },
      ],
    }).compile();

    controller = module.get<CompletedDerivationController>(
      CompletedDerivationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a completed derivation', async () => {
      const result = await controller.create(completedDerivationEntity);
      expect(result).toEqual(completedDerivationEntity);
    });
  });
});
