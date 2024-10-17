import { Test, TestingModule } from '@nestjs/testing';
import { DerivationsService } from './derivations.service';

describe('DerivationsService', () => {
  let service: DerivationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DerivationsService],
    }).compile();

    service = module.get<DerivationsService>(DerivationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
