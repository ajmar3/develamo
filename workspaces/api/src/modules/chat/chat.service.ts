import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CreateDirectMessageChatDto,
  NewMessageDto,
  ViewMessageDto,
} from "./chat.dtos";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createDirectMessageChat(
    model: CreateDirectMessageChatDto,
    developerId: string
  ) {
    if (!model.developerIds.find((x) => x == developerId))
      throw new BadRequestException("Cannot create that chat");

    const connectionList = await this.prisma.connectionList.findFirst({
      where: {
        developerId: developerId,
      },
      select: {
        connections: {
          select: {
            id: true,
            developerId: true,
          },
        },
      },
    });

    const connectionIds = connectionList.connections.map((x) => x.developerId);

    if (
      !model.developerIds.every(
        (x) => connectionIds.includes(x) || x == developerId
      )
    )
      throw new BadRequestException("Can only message your friends");

    if (model.developerIds.length != 2)
      throw new BadRequestException(
        "Direct message chats must be between 2 people"
      );

    const newChat = await this.prisma.directMessageChat.create({
      data: {
        participants: {
          connect: model.developerIds.map((x) => ({
            id: x,
          })),
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarURL: true,
          },
        },
        messages: {
          select: {
            id: true,
            text: true,
            sentAt: true,
            sender: {
              select: {
                id: true,
                name: true,
                githubUsername: true,
                avatarURL: true,
              },
            },
          },
          orderBy: {
            sentAt: "desc",
          },
        },
      },
    });

    return newChat;
  }

  async createDirectMessage(model: NewMessageDto, developerId: string) {
    const chat = await this.prisma.directMessageChat.findFirst({
      where: {
        id: model.chatId,
      },
      select: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      throw new BadRequestException("Could not find chat with that id");
    }

    if (!chat.participants.some((x) => x.id == developerId)) {
      throw new BadRequestException(
        "You do not have permission to send this message"
      );
    }

    await this.prisma.directMessage.create({
      data: {
        chatId: model.chatId,
        text: model.text,
        senderId: developerId,
        seen: false,
      },
    });

    const newChatMessages = await this.prisma.directMessageChat.findFirst({
      where: {
        id: model.chatId,
      },
      select: {
        messages: {
          select: {
            id: true,
            text: true,
            sentAt: true,
            seen: true,
            sender: {
              select: {
                avatarURL: true,
                name: true,
                id: true,
                githubUsername: true,
              },
            },
          },
          orderBy: {
            sentAt: "desc",
          },
        },
      },
    });

    return {
      messages: newChatMessages.messages,
      participants: chat.participants,
    };
  }

  async getChatInfoForDeveloper(developerId: string) {
    const directMessageChats = await this.prisma.directMessageChat.findMany({
      where: {
        participants: {
          some: {
            id: developerId,
          },
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            avatarURL: true,
            name: true,
            id: true,
            githubUsername: true,
          },
        },
        messages: {
          orderBy: {
            sentAt: "desc",
          },
          select: {
            seen: true,
            text: true,
            sentAt: true,
            sender: {
              select: {
                avatarURL: true,
                name: true,
                id: true,
                githubUsername: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    return {
      directMessageChats: directMessageChats,
      projectChats: [],
    };
  }

  async getDirectMessageChatInfo(chatId: string) {
    const info = await this.prisma.directMessageChat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarURL: true,
          },
        },
        messages: {
          select: {
            id: true,
            text: true,
            sentAt: true,
            sender: {
              select: {
                id: true,
                name: true,
                githubUsername: true,
                avatarURL: true,
              },
            },
          },
          orderBy: {
            sentAt: "desc",
          },
        },
      },
    });

    return info;
  }

  async viewDirectMessage(developerId: string, data: ViewMessageDto) {
    const chat = await this.prisma.directMessageChat.findFirst({
      where: {
        id: data.chatId,
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
          },
        },
        messages: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) throw new BadRequestException("No chat with that id found");
    if (!chat.participants.some((x) => x.id == developerId))
      throw new UnauthorizedException("You do not have access to that chat");

    await this.prisma.directMessage.updateMany({
      where: {
        id: {
          in: chat.messages.map((x) => x.id),
        },
        senderId: {
          not: developerId,
        },
        seen: false,
      },
      data: {
        seen: true,
      },
    });

    const newChatMessages = await this.prisma.directMessageChat.findFirst({
      where: {
        id: data.chatId,
      },
      select: {
        messages: {
          select: {
            id: true,
            text: true,
            sentAt: true,
            seen: true,
            sender: {
              select: {
                avatarURL: true,
                name: true,
                id: true,
                githubUsername: true,
              },
            },
          },
          orderBy: {
            sentAt: "desc",
          },
        },
      },
    });

    return { messages: newChatMessages.messages };
  }
}
