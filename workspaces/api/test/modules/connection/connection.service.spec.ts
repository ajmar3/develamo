import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { ConnectionService } from "src/modules/connection/connection.service";
import { PrismaService } from "src/modules/database/prisma.service";
import { NotificationService } from "src/modules/notification/notification.service";

describe("ConnectionService", () => {
  let service: ConnectionService;
  let prismaSerice: PrismaService;
  let notifService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionService,
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
        {
          provide: NotificationService,
          useValue: {
            createDeveloperNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConnectionService>(ConnectionService);
    prismaSerice = module.get<PrismaService>(PrismaService);
    notifService = module.get<NotificationService>(NotificationService);
  });

  describe("createConnectionRequest", () => {
    let listfindFirstSpy: jest.SpyInstance;
    let requestfindFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let notifSpy: jest.SpyInstance;

    beforeEach(() => {
      listfindFirstSpy = jest.spyOn(prismaSerice.connectionList, "findFirst");
      requestfindFirstSpy = jest.spyOn(
        prismaSerice.connectionRequest,
        "findFirst"
      );
      createSpy = jest.spyOn(prismaSerice.connectionRequest, "create");
      notifSpy = jest.spyOn(notifService, "createDeveloperNotification");
    });

    test("should create a connection request", async () => {
      const developerId = faker.datatype.uuid();
      const requestedId = faker.datatype.uuid();
      const connectionRequest = {
        id: faker.datatype.uuid(),
        requesterId: developerId,
        requestedId: requestedId,
      };
      const connectionRequestDto = {
        requestedId: requestedId,
      };

      listfindFirstSpy.mockResolvedValue({ connections: [] });
      requestfindFirstSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue(connectionRequest);
      notifSpy.mockResolvedValue(null);

      const result = await service.createConnectionRequest(
        connectionRequestDto,
        developerId
      );

      expect(result.request.requesterId).toEqual(connectionRequest.requesterId);
      expect(result.request.requestedId).toEqual(connectionRequest.requestedId);
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          requestedId: requestedId,
          requesterId: developerId,
        },
      });
      expect(notifSpy).toHaveBeenCalledWith({
        developerId: requestedId,
        referencedDeveloperId: developerId,
        message: "You have a new connection request!",
      });
    });

    test("should throw an error if the connection request already exists", async () => {
      const developerId = faker.datatype.uuid();
      const requestedId = faker.datatype.uuid();
      const connectionRequestDto = {
        requestedId: requestedId,
      };

      listfindFirstSpy.mockResolvedValue({ connections: [] });
      requestfindFirstSpy.mockResolvedValue({});

      await expect(
        service.createConnectionRequest(connectionRequestDto, developerId)
      ).rejects.toThrow("Connection request already exists.");
    });

    test("should throw an error if the developer is already connected", async () => {
      const developerId = faker.datatype.uuid();
      const requestedId = faker.datatype.uuid();
      const connectionRequestDto = {
        requestedId: requestedId,
      };

      listfindFirstSpy.mockResolvedValue({
        connections: [{ developerId: requestedId }],
      });

      await expect(
        service.createConnectionRequest(connectionRequestDto, developerId)
      ).rejects.toThrow("Connection already exists.");
    });
  });

  describe("acceptConnectionRequest", () => {
    let updateSpy: jest.SpyInstance;
    let requestfindFirstSpy: jest.SpyInstance;
    let createManySpy: jest.SpyInstance;
    let notifSpy: jest.SpyInstance;
    let dmCreateSpy: jest.SpyInstance;
    let listfindManySpy: jest.SpyInstance;
    let devFindFirstSpy: jest.SpyInstance;

    beforeEach(() => {
      updateSpy = jest.spyOn(prismaSerice.connectionRequest, "update");
      requestfindFirstSpy = jest.spyOn(
        prismaSerice.connectionRequest,
        "findFirst"
      );
      createManySpy = jest.spyOn(prismaSerice.connection, "createMany");
      notifSpy = jest.spyOn(notifService, "createDeveloperNotification");
      dmCreateSpy = jest.spyOn(prismaSerice.directMessageChat, "create");
      listfindManySpy = jest.spyOn(prismaSerice.connectionList, "findMany");
      devFindFirstSpy = jest.spyOn(prismaSerice.developer, "findFirst");
    });

    test("should accept a connection request", async () => {
      const developerId = faker.datatype.uuid();
      const connectionRequestId = faker.datatype.uuid();
      const connectionRequest = {
        id: connectionRequestId,
        requestedId: developerId,
        requesterId: faker.datatype.uuid(),
        resolved: true,
        successfull: true,
      };
      const connection = {
        id: faker.datatype.uuid(),
        developerId: connectionRequest.requestedId,
        connectionList: {
          connect: {
            developerId: connectionRequest.requesterId,
          },
        },
      };

      updateSpy.mockResolvedValue(connectionRequest);
      listfindManySpy.mockResolvedValue([
        { developerId: developerId, id: faker.datatype.uuid() },
        {
          developerId: connectionRequest.requesterId,
          id: faker.datatype.uuid(),
        },
      ]);
      requestfindFirstSpy.mockResolvedValue(connectionRequest);
      createManySpy.mockResolvedValue([connection, connection]);
      dmCreateSpy.mockResolvedValue({ id: faker.datatype.uuid() });
      notifSpy.mockResolvedValue(null);
      devFindFirstSpy.mockResolvedValue({
        connectionRequests: [],
        connectionList: { connections: [connection] },
      });

      const result = await service.acceptConnectionRequest(
        { requestId: connectionRequestId },
        developerId
      );

      expect(result.requests).toHaveLength(0);
      expect(result.connections).toHaveLength(1);
      expect(notifSpy).toHaveBeenCalledWith({
        developerId: connectionRequest.requesterId,
        referencedDeveloperId: connectionRequest.requestedId,
        message: "Connection request accepted!",
      });
    });

    test("should throw an error if the connection request does not exist", async () => {
      const developerId = faker.datatype.uuid();
      const connectionRequestId = faker.datatype.uuid();

      requestfindFirstSpy.mockResolvedValue(null);

      await expect(
        service.acceptConnectionRequest(
          { requestId: connectionRequestId },
          developerId
        )
      ).rejects.toThrow("Could not find that request");
    });
  });

  describe("rejectConnectionRequest", () => {
    let updateSpy: jest.SpyInstance;
    let devFindFirstSpy: jest.SpyInstance;
    let findFirstSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.connectionRequest, "findFirst");
      updateSpy = jest.spyOn(prismaSerice.connectionRequest, "update");
      devFindFirstSpy = jest.spyOn(prismaSerice.developer, "findFirst");
    });

    test("should reject a connection request", async () => {
      const developerId = faker.datatype.uuid();
      const connectionRequestId = faker.datatype.uuid();
      const connectionRequest = {
        id: connectionRequestId,
        requestedId: developerId,
        requesterId: faker.datatype.uuid(),
        resolved: true,
        successfull: false,
      };

      findFirstSpy.mockResolvedValue(connectionRequest);
      updateSpy.mockResolvedValue(connectionRequest);
      devFindFirstSpy.mockResolvedValue({
        connectionRequests: [],
        connectionList: { connections: [] },
      });

      const result = await service.rejectConnectionRequest(
        { requestId: connectionRequestId },
        developerId
      );

      expect(result.requests).toHaveLength(0);
      expect(result.connections).toHaveLength(0);
    });

    test("should throw an error if the connection request does not exist", async () => {
      const developerId = faker.datatype.uuid();
      const connectionRequestId = faker.datatype.uuid();

      updateSpy.mockResolvedValue(null);

      await expect(
        service.rejectConnectionRequest(
          { requestId: connectionRequestId },
          developerId
        )
      ).rejects.toThrow("Could not find that request");
    });
  });
});
