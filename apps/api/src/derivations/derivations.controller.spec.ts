import { Test, TestingModule } from '@nestjs/testing';
import { DerivationsController } from './derivations.controller';
import { DerivationsService } from './derivations.service';

describe('DerivationsController', () => {
  let controller: DerivationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerivationsController],
      providers: [
        {
          provide: DerivationsService,
          useValue: {
            createDerivation: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DerivationsController>(DerivationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
