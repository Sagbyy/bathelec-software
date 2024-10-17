import { Test, TestingModule } from '@nestjs/testing';
import { DerivationsController } from './derivations.controller';

describe('DerivationsController', () => {
  let controller: DerivationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerivationsController],
    }).compile();

    controller = module.get<DerivationsController>(DerivationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
