import { Test, TestingModule } from '@nestjs/testing';
import { CompletedDerivationController } from './completed-derivation.controller';
import { CompletedDerivationService } from './completed-derivation.service';

describe('CompletedDerivationController', () => {
  let controller: CompletedDerivationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedDerivationController],
      providers: [CompletedDerivationService],
    }).compile();

    controller = module.get<CompletedDerivationController>(CompletedDerivationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
