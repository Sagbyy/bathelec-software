import { Test, TestingModule } from '@nestjs/testing';
import { DerivationsService } from './derivations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DerivationsService', () => {
  let service: DerivationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivationsService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            derivation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DerivationsService>(DerivationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
