import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CachingService } from "src/modules/caching/caching.service";
import { PrismaService } from "src/modules/database/prisma.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { KanbanService } from "src/modules/project/kanban/kanban.service";
import { ProjectService } from "src/modules/project/project.service";

describe("ProjectService", () => {
  let service: ProjectService;
  let prismaSerice: PrismaService;
  let cachingService: CachingService;
  let notifService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            projectChatChannel: {
              create: jest.fn(),
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
            projectApplication: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: NotificationService,
          useValue: {
            createProjectNotification: jest.fn(),
          },
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
            createProjectNotification: jest.fn(),
            getChannelInfoFromCache: jest.fn(),
          },
        },
        {
          provide: KanbanService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prismaSerice = module.get<PrismaService>(PrismaService);
    cachingService = module.get<CachingService>(CachingService);
    notifService = module.get<NotificationService>(NotificationService);
  });

  describe("createProject", () => {
    let findManyProjectsSpy: jest.SpyInstance;
    let createProjectSpy: jest.SpyInstance;
    let createProjectChatChannel: jest.SpyInstance;

    beforeEach(() => {
      findManyProjectsSpy = jest.spyOn(prismaSerice.project, "findMany");
      createProjectSpy = jest.spyOn(prismaSerice.project, "create");
      createProjectChatChannel = jest.spyOn(
        prismaSerice.projectChatChannel,
        "create"
      );
    });

    test("should create a project", async () => {
      const developerId = faker.datatype.uuid();
      const project = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        chat: {
          id: faker.datatype.uuid(),
        },
      };

      findManyProjectsSpy.mockResolvedValue([]);
      createProjectSpy.mockResolvedValue(project);
      createProjectChatChannel.mockResolvedValue({});
      const result = await service.createProject(project, developerId);

      expect(result).toEqual(project.id);
      expect(prismaSerice.project.create).toBeCalledTimes(1);
      expect(prismaSerice.projectChatChannel.create).toBeCalledTimes(1);
    });

    test("should throw an error if the project title already exists", async () => {
      const developerId = faker.datatype.uuid();
      const project = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        chat: {
          id: faker.datatype.uuid(),
        },
      };

      findManyProjectsSpy.mockResolvedValue([project]);
      createProjectSpy.mockResolvedValue(project);
      createProjectChatChannel.mockResolvedValue({});
      try {
        await service.createProject(project, developerId);
      } catch (error) {
        expect(error.message).toEqual(
          "You already have a project with that name"
        );
      }
    });

    test("should throw an error if the user has reached the maximum number of projects", async () => {
      const developerId = faker.datatype.uuid();
      const project1 = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
        chat: {
          id: faker.datatype.uuid(),
        },
      };
      const project2 = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
        chat: {
          id: faker.datatype.uuid(),
        },
      };
      const project3 = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
        chat: {
          id: faker.datatype.uuid(),
        },
      };
      const project4 = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
        chat: {
          id: faker.datatype.uuid(),
        },
      };
      const project5 = {
        id: faker.datatype.uuid(),
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
        chat: {
          id: faker.datatype.uuid(),
        },
      };

      findManyProjectsSpy.mockResolvedValue([
        project1,
        project2,
        project3,
        project4,
      ]);
      createProjectSpy.mockResolvedValue(project5);
      createProjectChatChannel.mockResolvedValue({});

      await expect(
        service.createProject(project5, developerId)
      ).rejects.toThrowError("You can only have 3 active projects at once");
    });
  });

  describe("getProjectInfoById", () => {
    let findFirstSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
    });

    test("should return the project info", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();
      const project = {
        id: projectId,
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: developerId,
        repoURL: faker.internet.url(),
        owner: {
          id: developerId,
        },
        developers: [],
        tagIds: [faker.datatype.uuid()],
        finished: false,
      };

      findFirstSpy.mockResolvedValue(project);
      const result = await service.getProjectInfoById(projectId, developerId);

      expect(result).toEqual(project);
    });

    test("should throw an error if the project does not exist", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue(null);
      await expect(
        service.getProjectInfoById(projectId, developerId)
      ).rejects.toThrowError("could not find project with that Id");
    });

    test("should throw an error is user does not have access to the project", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();
      const project = {
        id: projectId,
        title: faker.name.firstName(),
        description: faker.lorem.paragraph(),
        ownerId: faker.datatype.uuid(),
        developers: [],
        owner: {
          id: faker.datatype.uuid(),
        },
        repoURL: faker.internet.url(),
        tagIds: [faker.datatype.uuid()],
        finished: false,
      };

      findFirstSpy.mockResolvedValue(project);
      await expect(
        service.getProjectInfoById(projectId, developerId)
      ).rejects.toThrowError("You are not authorised for this project");
    });
  });

  describe("createProjectApplication", () => {
    let findFirstSpy: jest.SpyInstance;
    let findFirstApplicationSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
      findFirstApplicationSpy = jest.spyOn(
        prismaSerice.projectApplication,
        "findFirst"
      );
      createSpy = jest.spyOn(prismaSerice.projectApplication, "create");
    });

    test("should create a project application", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();
      const project = {
        id: projectId,
        ownerId: faker.datatype.uuid(),
      };

      findFirstSpy.mockResolvedValue(project);
      findFirstApplicationSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue("application");
      const result = await service.createProjectApplication(
        { projectId: projectId },
        developerId
      );

      expect(result).toEqual("application");
      expect(prismaSerice.projectApplication.create).toBeCalledTimes(1);
      expect(notifService.createProjectNotification).toBeCalledTimes(1);
    });

    test("should throw an error if the project does not exist", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue(null);
      await expect(
        service.createProjectApplication({ projectId: projectId }, developerId)
      ).rejects.toThrowError("could not find that project");
    });

    test("should throw an error if the user has already applied to the project", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();
      const project = {
        id: projectId,
        ownerId: faker.datatype.uuid(),
      };

      findFirstSpy.mockResolvedValue(project);
      findFirstApplicationSpy.mockResolvedValue("application");
      await expect(
        service.createProjectApplication({ projectId: projectId }, developerId)
      ).rejects.toThrowError("You have already applied to that project");
    });
  });

  describe("createProjectChatChannel", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.project, "findFirst");
      createSpy = jest.spyOn(prismaSerice.projectChatChannel, "create");
    });

    test("should create a project chat channel", async () => {
      const developerId = faker.datatype.uuid();
      const projectId = faker.datatype.uuid();
      const project = {
        id: projectId,
        ownerId: developerId,
        chat: {
          id: faker.datatype.uuid(),
          channels: [],
        },
      };

      findFirstSpy.mockResolvedValue(project);
      createSpy.mockResolvedValue("chatChannel");
      const result = await service.createChannel(developerId, {
        projectId: projectId,
        name: faker.name.firstName(),
      });

      expect(result).toEqual("chatChannel");
      expect(prismaSerice.projectChatChannel.create).toBeCalledTimes(1);
    });
  });

  describe("openChannel", () => {
    let findFromCache: jest.SpyInstance;

    beforeEach(() => {
      findFromCache = jest.spyOn(cachingService, "getChannelInfoFromCache");
    });

    test("should open a channel", async () => {
      const developerId = faker.datatype.uuid();
      const channelId = faker.datatype.uuid();
      const channel = {
        id: channelId,
        participants: [{ id: developerId }],
      };

      findFromCache.mockResolvedValue(channel);
      const result = await service.openChannel(developerId, channelId);

      expect(result).toEqual({
        id: channelId,
        participants: [{ id: developerId }],
      });
    });

    test("should throw and error if user doesnt have access to channel", async () => {
      const developerId = faker.datatype.uuid();
      const channelId = faker.datatype.uuid();
      const channel = {
        id: channelId,
        participants: [],
      };

      findFromCache.mockResolvedValue(channel);

      await expect(
        service.openChannel(developerId, channelId)
      ).rejects.toThrowError("You do not have access to that channel");
    });
  });
});
