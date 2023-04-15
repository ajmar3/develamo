import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CachingService } from "src/modules/caching/caching.service";
import { PrismaService } from "src/modules/database/prisma.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { KanbanService } from "src/modules/project/kanban/kanban.service";
import { ProjectService } from "src/modules/project/project.service";

describe("KanbanService", () => {
  let service: KanbanService;
  let prismaSerice: PrismaService;
  let cachingService: CachingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KanbanService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            developer: {
              findFirst: jest.fn(),
            },
            ticketList: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            ticket: {
              create: jest.fn(),
              findMany: jest.fn(),
              findfirst: jest.fn(),
            },
          },
        },
        {
          provide: NotificationService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: CachingService,
          useValue: {
            writeTicketListInfoToCache: jest.fn(),
            updateTicketList: jest.fn(),
          },
        },
        {
          provide: ProjectService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<KanbanService>(KanbanService);
    prismaSerice = module.get<PrismaService>(PrismaService);
    cachingService = module.get<CachingService>(CachingService);
  });

  describe("getProjectTicketLists", () => {
    let findFirstSpy: jest.SpyInstance;
    let writeTicketCacheSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
      writeTicketCacheSpy = jest.spyOn(
        cachingService,
        "writeTicketListInfoToCache"
      );
    });

    test("should return ticket lists", async () => {
      const projectId = faker.datatype.uuid();
      const ticketLists = [
        {
          id: projectId,
          name: "Backlog",
          orderIndex: 1,
          tickets: [
            {
              id: 1,
              title: "Ticket 1",
              description: "Ticket 1 description",
              orderIdex: 1,
              ticketListId: 1,
            },
          ],
        },
      ];

      const developerId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        id: projectId,
        ticketLists,
        ownerId: developerId,
        developers: [],
      });

      const result = await service.getProjectTicketLists(
        projectId,
        developerId
      );

      expect(result).toEqual(ticketLists);
      expect(writeTicketCacheSpy).toHaveBeenCalledWith(ticketLists, projectId);
    });

    test("should throw error if project not found", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue(null);

      await expect(
        service.getProjectTicketLists(projectId, developerId)
      ).rejects.toThrowError("Could not find that project");
    });

    test("should throw error if developer not part of project", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        id: projectId,
        ticketLists: [],
        ownerId: faker.datatype.uuid(),
        developers: [],
      });

      await expect(
        service.getProjectTicketLists(projectId, developerId)
      ).rejects.toThrowError("You are not part of that project");
    });
  });

  describe("createTicketList", () => {
    let findFirstSpy: jest.SpyInstance;
    let ticketListCreateSpy: jest.SpyInstance;
    let updateTicketListCacheSpy: jest.SpyInstance;
    let ticketListfindManySpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
      updateTicketListCacheSpy = jest.spyOn(cachingService, "updateTicketList");
      ticketListCreateSpy = jest.spyOn(prismaSerice.ticketList, "create");
      ticketListfindManySpy = jest.spyOn(prismaSerice.ticketList, "findMany");
    });

    test("should create ticket list", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();
      const ticketListName = faker.lorem.word();

      findFirstSpy.mockResolvedValue({
        id: projectId,
        ticketLists: [],
        ownerId: developerId,
        developers: [],
      });

      const ticketList = {
        id: faker.datatype.uuid(),
        name: ticketListName,
        orderIndex: 1,
        tickets: [],
      };

      ticketListCreateSpy.mockResolvedValue(ticketList);
      ticketListfindManySpy.mockResolvedValue([ticketList]);

      const result = await service.createTicketList(
        { projectId: projectId, title: ticketListName },
        developerId
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(ticketList);
      expect(updateTicketListCacheSpy).toHaveBeenCalledWith(
        [ticketList],
        projectId
      );
    });

    test("should throw error if project not found", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();
      const ticketListName = faker.lorem.word();

      findFirstSpy.mockResolvedValue(null);

      await expect(
        service.createTicketList(
          { projectId: projectId, title: ticketListName },
          developerId
        )
      ).rejects.toThrowError("Could not find that project");
    });
  });

  describe("CreateTicket", () => {
    let projectfindFirstSpy: jest.SpyInstance;
    let ticketCreateSpy: jest.SpyInstance;
    let updateTicketListCacheSpy: jest.SpyInstance;
    let ticketListfindFirstSpy: jest.SpyInstance;

    beforeEach(() => {
      projectfindFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
      updateTicketListCacheSpy = jest.spyOn(cachingService, "updateTicketList");
      ticketCreateSpy = jest.spyOn(prismaSerice.ticket, "create");
      ticketListfindFirstSpy = jest.spyOn(prismaSerice.ticketList, "findFirst");
    });

    test("should create ticket", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();
      const ticketListName = faker.lorem.word();

      const ticket = {
        id: faker.datatype.uuid(),
      };

      const ticketList = {
        id: faker.datatype.uuid(),
        tickets: [],
      };

      projectfindFirstSpy.mockResolvedValue({
        id: projectId,
        ticketLists: [ticketList],
        ownerId: developerId,
        developers: [],
      });

      ticketCreateSpy.mockResolvedValue(ticket);
      ticketListfindFirstSpy.mockResolvedValue(ticketList);

      const result = await service.createTicket(
        {
          projectId: projectId,
          title: ticketListName,
          ticketListId: ticketList.id,
        },
        developerId
      );

      expect(result).toBeDefined();
      expect(updateTicketListCacheSpy).toHaveBeenCalledWith(
        ticketList,
        projectId
      );
    });

    test("should throw error if project not found", async () => {
      const projectId = faker.datatype.uuid();
      const developerId = faker.datatype.uuid();
      const ticketListName = faker.lorem.word();

      projectfindFirstSpy.mockResolvedValue(null);

      const ticketList = {
        id: faker.datatype.uuid(),
      };

      await expect(
        service.createTicket(
          {
            projectId: projectId,
            title: ticketListName,
            ticketListId: ticketList.id,
          },
          developerId
        )
      ).rejects.toThrowError("Could not find that project");
    });
  });
});
