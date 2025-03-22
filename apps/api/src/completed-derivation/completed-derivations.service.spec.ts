import { Test, TestingModule } from '@nestjs/testing';
import { CompletedDerivationService } from './completed-derivations.service';

describe('CompletedDerivationService', () => {
  let service: CompletedDerivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletedDerivationService],
    }).compile();

    service = module.get<CompletedDerivationService>(
      CompletedDerivationService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a completed derivation', async () => {
    const completedDerivation = await service.create({
      requestedDerivationId: 1,
      clientInfo: {
        name: 'John Doe',
        phone: '1234567890',
        folio: '1234567890',
      },
      generalInfo: {
        dateTime: new Date(),
        derivationBy: 'John Doe',
        address: {
          street: '123 Main St',
          postalCode: '12345',
          city: 'Anytown',
        },
        building: '123 Main St',
        cmIdentification: '1234567890',
        floor: '1',
        situation: '1',
        comment: '1',
      },
      photoBeforeWork: {
        photo: '1234567890',
      },
      oldMeter: {
        type: '1',
        generation: '1',
        preserved: true,
        serialNumber: '1234567890',
        key: '1',
        dayIndex: '1',
        nightIndex: '1',
      },
      newDerivation: {
        section: '1',
        cableType: '1',
        length: 1,
      },
      newMeter: {
        generation: '1',
        serialNumber: '1234567890',
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
      photoAfterWork: {
        photo: '1234567890',
      },
      clientValidation: {
        present: true,
        workValidation: true,
        satisfactionLevel: '1',
        clientComment: '1',
        signature: '1234567890',
        technicianComment: '1',
      },
    });

    expect(completedDerivation).toBeDefined();
    expect(completedDerivation.clientInfo).toEqual({
      name: 'John Doe',
      phone: '1234567890',
      folio: '1234567890',
    });
    expect(completedDerivation.generalInfo).toEqual({
      dateTime: new Date(),
      derivationBy: 'John Doe',
      address: {
        street: '123 Main St',
        postalCode: '12345',
        city: 'Anytown',
      },
      building: '123 Main St',
      cmIdentification: '1234567890',
      floor: '1',
      situation: '1',
      comment: '1',
    });
    expect(completedDerivation.photoBeforeWork).toEqual({
      photo: '1234567890',
    });
    expect(completedDerivation.oldMeter).toEqual({
      type: '1',
      generation: '1',
      preserved: true,
      serialNumber: '1234567890',
      key: '1',
      dayIndex: '1',
      nightIndex: '1',
    });
    expect(completedDerivation.newDerivation).toEqual({
      section: '1',
      cableType: '1',
      length: 1,
    });
    expect(completedDerivation.newMeter).toEqual({
      generation: '1',
      serialNumber: '1234567890',
      dayIndex: '1',
      nightIndex: '1',
      indexPhoto: '1234567890',
    });
    expect(completedDerivation.circuitBreaker).toEqual({
      preserved: true,
      voltage: '1',
      brand: '1',
      type: '1',
      power: '1',
      commissioningDone: true,
      sealed: true,
    });
    expect(completedDerivation.photoAfterWork).toEqual({
      photo: '1234567890',
    });
    expect(completedDerivation.clientValidation).toEqual({
      present: true,
      workValidation: true,
      satisfactionLevel: '1',
      clientComment: '1',
      signature: '1234567890',
      technicianComment: '1',
    });
  });
});
