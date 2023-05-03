import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/modules/database/prisma.service";
import { SearchService } from "src/modules/search/search.service";

describe("DeveloperService", () => {
  let service: SearchService;
  let prismaSerice: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    prismaSerice = module.get<PrismaService>(PrismaService);
  });

  //no business logic to test

  test("should be defined", () => {
    expect(service).toBeDefined();
  });
});
