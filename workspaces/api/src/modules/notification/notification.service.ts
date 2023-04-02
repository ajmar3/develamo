import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CreateChatNotificationDto,
  CreateDeveloperNotificationDto,
  CreateProjectNotificationDto,
  GetNotificationDto,
} from "./notification.dto";
import { NOtificationTypeEnum } from "./notification.enums";
import { NotificationGateway } from "./notification.gateway";

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private gateway: NotificationGateway
  ) {}

  async createChatNotification(data: CreateChatNotificationDto) {
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        message: data.message,
        developerId: data.developerId,
        referencedChatId: data.referencedChatId,
        seen: false,
        type: NOtificationTypeEnum.CHAT,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        referencedChat: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
      },
    });

    if (existingNotification) return;

    const newNotification = await this.prisma.notification.create({
      data: {
        message: data.message,
        referencedChatId: data.referencedChatId,
        developerId: data.developerId,
        type: NOtificationTypeEnum.CHAT,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        referencedChat: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
      },
    });

    await this.gateway.sendNotification(data.developerId, newNotification);

    return;
  }

  async createProjectNotification(data: CreateProjectNotificationDto) {
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        message: data.message,
        developerId: data.developerId,
        referencedProjectId: data.referencedProjectId,
        seen: false,
        type: NOtificationTypeEnum.PROJECT,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        referencedProject: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (existingNotification) return;

    const newNotification = await this.prisma.notification.create({
      data: {
        message: data.message,
        referencedProjectId: data.referencedProjectId,
        developerId: data.developerId,
        type: NOtificationTypeEnum.PROJECT,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        referencedProject: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await this.gateway.sendNotification(data.developerId, newNotification);

    return;
  }

  async createDeveloperNotification(data: CreateDeveloperNotificationDto) {
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        message: data.message,
        developerId: data.developerId,
        referencedDeveloperId: data.referencedDeveloperId,
        seen: false,
        type: NOtificationTypeEnum.DEVELOPER,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        developerId: true,
        referencedDeveloper: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
      },
    });

    if (existingNotification) return;

    const newNotification = await this.prisma.notification.create({
      data: {
        message: data.message,
        referencedDeveloperId: data.referencedDeveloperId,
        developerId: data.developerId,
        type: NOtificationTypeEnum.DEVELOPER,
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        developerId: true,
        referencedDeveloper: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
      },
    });

    await this.gateway.sendNotification(data.developerId, newNotification);

    return;
  }

  async getNotifications(developerId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        developerId: developerId,
      },
      orderBy: [
        {
          seen: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 8,
      skip: 0,
      select: {
        id: true,
        message: true,
        seen: true,
        referencedDeveloper: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
        referencedProject: {
          select: {
            id: true,
            title: true,
          },
        },
        referencedChat: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
      },
    });

    return notifications;
  }

  async markNotificationAsRead(notificationId: string, developerId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        developerId: developerId,
      },
    });

    if (!notification) throw new BadRequestException("Notification not found");

    const updated = await this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        seen: true,
        seenAt: new Date(),
      },
      select: {
        id: true,
        message: true,
        seen: true,
        createdAt: true,
        referencedDeveloper: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
        referencedProject: {
          select: {
            id: true,
            title: true,
          },
        },
        referencedChat: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
          },
        },
      },
    });

    return updated;
  }
}
