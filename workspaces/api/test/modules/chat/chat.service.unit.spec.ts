import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "src/modules/chat/chat.service";
import { PrismaService } from "src/modules/database/prisma.service";

describe("ChatService", () => {
  let service: ChatService;
  let prismaSerice: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: {
            connectionList: {
              findFirst: jest.fn(),
            },
            directMessageChat: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
            directMessage: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prismaSerice = module.get<PrismaService>(PrismaService);
  });

  describe("Create Direct Message Chat", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    beforeEach(() => {
      const adminEmail = faker.internet.email();
      const adminPassword = faker.internet.password();
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = adminPassword;

      findFirstSpy = jest.spyOn(prismaSerice.connectionList, "findFirst");
      createSpy = jest.spyOn(prismaSerice.directMessageChat, "create");
    });

    test("should throw an error if the developer is not in the chat", async () => {
      findFirstSpy.mockResolvedValue(null);
      const createDirectMessageChatDto = {
        developerIds: [faker.datatype.uuid()],
      };

      const developerId = faker.datatype.uuid();

      await expect(
        service.createDirectMessageChat(createDirectMessageChatDto, developerId)
      ).rejects.toThrow("Cannot create that chat");
    });

    test("should throw an error if the developer is not friends with the other developer", async () => {
      const devId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({ connections: [] });

      const createDirectMessageChatDto = {
        developerIds: [devId, faker.datatype.uuid()],
      };

      await expect(
        service.createDirectMessageChat(createDirectMessageChatDto, devId)
      ).rejects.toThrow("Can only message your friends");
    });

    test("should throw an error if the chat is not between 2 people", async () => {
      const developerId = faker.datatype.uuid();
      const friend1 = faker.datatype.uuid();
      const friend2 = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        connections: [
          { developerId: friend1 },
          { developerId: friend2 },
          { developerId: developerId },
        ],
      });

      const createDirectMessageChatDto = {
        developerIds: [developerId, friend1, friend2],
      };

      await expect(
        service.createDirectMessageChat(createDirectMessageChatDto, developerId)
      ).rejects.toThrow("Direct message chats must be between 2 people");
    });

    test("should create a direct message chat", async () => {
      const developerId = faker.datatype.uuid();
      const friend1 = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        connections: [{ developerId: friend1 }, { developerId: developerId }],
      });

      createSpy.mockResolvedValue({
        id: faker.datatype.uuid(),
        participants: [{ developerId: friend1 }, { developerId: developerId }],
      });

      const createDirectMessageChatDto = {
        developerIds: [friend1, developerId],
      };

      const newChat = await service.createDirectMessageChat(
        createDirectMessageChatDto,
        developerId
      );

      expect(newChat.id).toBeDefined();
      expect(newChat.participants).toHaveLength(2);
      expect(newChat.participants).toEqual([
        { developerId: friend1 },
        { developerId: developerId },
      ]);
    });
  });

  describe("Create direct message", () => {
    let findFirstSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    beforeEach(() => {
      findFirstSpy = jest.spyOn(prismaSerice.directMessageChat, "findFirst");
      createSpy = jest.spyOn(prismaSerice.directMessage, "create");
    });

    test("should throw an error if the chat is not found", async () => {
      findFirstSpy.mockResolvedValue(null);
      const createDirectMessageDto = {
        chatId: faker.datatype.uuid(),
        text: faker.lorem.sentence(),
      };

      const developerId = faker.datatype.uuid();

      await expect(
        service.createDirectMessage(createDirectMessageDto, developerId)
      ).rejects.toThrow("Could not find chat with that id");
    });

    test("should throw an error if the developer is not in the chat", async () => {
      const chatId = faker.datatype.uuid();
      const devId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        participants: [{ id: faker.datatype.uuid() }],
      });

      const createDirectMessageDto = {
        chatId,
        text: faker.lorem.sentence(),
      };

      await expect(
        service.createDirectMessage(createDirectMessageDto, devId)
      ).rejects.toThrow("You do not have permission to send this message");
    });

    test("should create a direct message", async () => {
      const chatId = faker.datatype.uuid();
      const devId = faker.datatype.uuid();

      findFirstSpy.mockResolvedValue({
        participants: [{ id: devId }],
      });

      createSpy.mockResolvedValue({
        id: faker.datatype.uuid(),
        text: faker.lorem.sentence(),
        chatId,
        authorId: devId,
      });

      const createDirectMessageDto = {
        chatId,
        text: faker.lorem.sentence(),
      };

      const newMessages = await service.createDirectMessage(
        createDirectMessageDto,
        devId
      );

      expect(newMessages).toBeDefined();
    });
  });
});
