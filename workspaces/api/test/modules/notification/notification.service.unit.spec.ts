import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/modules/database/prisma.service";
import { NotificationGateway } from "src/modules/notification/notification.gateway";
import { NotificationService } from "src/modules/notification/notification.service";

describe("NotificationService", () => {
  let service: NotificationService;
  let prismaSerice: PrismaService;
  let gateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            developer: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: NotificationGateway,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaSerice = module.get<PrismaService>(PrismaService);
    gateway = module.get<NotificationGateway>(NotificationGateway);
  });

  describe("createChatNotification", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.notification, "findFirst");
      createSpy = jest.spyOn(prismaSerice.notification, "create");
      sendSpy = jest.spyOn(gateway, "sendNotification");
    });

    test("should create a notification for the chat", async () => {
      findFirstSpy.mockResolvedValueOnce(undefined);
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createChatNotificationDto = {
        referencedChatId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createChatNotification(createChatNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });

    test("should not create a notification for chat if one exists", async () => {
      findFirstSpy.mockResolvedValueOnce("notification");
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createChatNotificationDto = {
        referencedChatId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createChatNotification(createChatNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(sendSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("createDeveloperNotification", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.notification, "findFirst");
      createSpy = jest.spyOn(prismaSerice.notification, "create");
      sendSpy = jest.spyOn(gateway, "sendNotification");
    });

    test("should create a notification for the developer", async () => {
      findFirstSpy.mockResolvedValueOnce(undefined);
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createDeveloperNotificationDto = {
        referencedDeveloperId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createDeveloperNotification(createDeveloperNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });

    test("should not create a notification for developer if one exists", async () => {
      findFirstSpy.mockResolvedValueOnce("notification");
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createDeveloperNotificationDto = {
        referencedDeveloperId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createDeveloperNotification(createDeveloperNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(sendSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("createProjectNotification", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.notification, "findFirst");
      createSpy = jest.spyOn(prismaSerice.notification, "create");
      sendSpy = jest.spyOn(gateway, "sendNotification");
    });

    test("should create a notification for the project", async () => {
      findFirstSpy.mockResolvedValueOnce(undefined);
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createProjectNotificationDto = {
        referencedProjectId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createProjectNotification(createProjectNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });

    test("should not create a notification for project if one exists", async () => {
      findFirstSpy.mockResolvedValueOnce("notification");
      createSpy.mockResolvedValueOnce({ id: 1 });
      sendSpy.mockImplementationOnce(() => undefined);

      const createProjectNotificationDto = {
        referencedProjectId: faker.datatype.uuid(),
        developerId: faker.datatype.uuid(),
        message: faker.lorem.sentence(),
      };

      await service.createProjectNotification(createProjectNotificationDto);

      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(sendSpy).toHaveBeenCalledTimes(0);
    });
  });
});
