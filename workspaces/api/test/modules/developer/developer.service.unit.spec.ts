import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/modules/database/prisma.service";
import { DeveloperService } from "src/modules/developer/developer.service";

describe("DeveloperService", () => {
  let service: DeveloperService;
  let prismaSerice: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeveloperService,
        {
          provide: PrismaService,
          useValue: {
            connectionList: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
            },
            connection: {
              create: jest.fn(),
              createMany: jest.fn(),
              findFirst: jest.fn(),
            },
            connectionRequest: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            directMessageChat: {
              create: jest.fn(),
            },
            developer: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DeveloperService>(DeveloperService);
    prismaSerice = module.get<PrismaService>(PrismaService);
  });

  test("should be defined", () => {
    expect(service).toBeDefined();
  });
});
