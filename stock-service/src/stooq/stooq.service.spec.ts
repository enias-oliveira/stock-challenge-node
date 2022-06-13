import { Test, TestingModule } from '@nestjs/testing';
import { StooqService } from './stooq.service';

describe('StooqService', () => {
  let service: StooqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StooqService],
    }).compile();

    service = module.get<StooqService>(StooqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
