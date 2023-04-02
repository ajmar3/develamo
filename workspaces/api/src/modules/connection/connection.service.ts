import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CreateConnectionRequestDto,
  RespondConnectionRequestDto,
} from "./connection.dtos";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class ConnectionService {
  constructor(
    private prismaServie: PrismaService,
    private notifService: NotificationService
  ) {}

  async getConnectionsForDeveloper(developerId: string) {
    const developer = await this.prismaServie.developer.findFirst({
      where: {
        id: developerId,
      },
      select: {
        id: true,
        connectionList: {
          select: {
            connections: {
              select: {
                id: true,
                developerId: true,
                developer: {
                  select: {
                    avatarURL: true,
                    id: true,
                    name: true,
                    githubUsername: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const connectionRequests =
      await this.prismaServie.connectionRequest.findMany({
        where: {
          AND: [
            {
              requestedId: developerId,
            },
            {
              resolved: false,
            },
          ],
        },
      });

    if (connectionRequests.length > 0) {
      const requesterInfo = await this.prismaServie.developer.findMany({
        where: {
          id: {
            in: connectionRequests.map((x) => x.requesterId),
          },
        },
      });

      connectionRequests.forEach((request) => {
        const matchingInfo = requesterInfo.find(
          (x) => x.id == request.requesterId
        );

        request["requesterName"] = matchingInfo.name;
        request["requesterGithubUsername"] = matchingInfo.githubUsername;
        request["requesterAvatarURL"] = matchingInfo.avatarURL;
      });
    }

    const sentRequests = await this.prismaServie.connectionRequest.findMany({
      where: {
        AND: [
          {
            requesterId: developerId,
          },
          {
            resolved: false,
          },
        ],
      },
    });

    return {
      connections: developer.connectionList.connections,
      requests: connectionRequests,
      sentRequests: sentRequests,
    };
  }

  async createConnectionRequest(
    model: CreateConnectionRequestDto,
    developerId: string
  ) {
    const currentConnectionList =
      await this.prismaServie.connectionList.findFirst({
        where: {
          developerId: developerId,
        },
        include: {
          connections: true,
        },
      });

    const connectionExists = currentConnectionList.connections
      .map((x) => x.developerId)
      .includes(model.requestedId);

    if (connectionExists)
      throw new BadRequestException("Connection already exists.");

    const requestExists = await this.prismaServie.connectionRequest.findFirst({
      where: {
        AND: [
          {
            requestedId: model.requestedId,
          },
          {
            requesterId: developerId,
          },
          {
            resolved: false,
          },
        ],
      },
    });

    if (requestExists)
      throw new BadRequestException("Connection request already exists.");

    const newConnectionRequest =
      await this.prismaServie.connectionRequest.create({
        data: {
          requesterId: developerId,
          requestedId: model.requestedId,
        },
      });

    await this.notifService.createDeveloperNotification({
      developerId: model.requestedId,
      referencedDeveloperId: developerId,
      message: "You have a new connection request!",
    });

    return { request: newConnectionRequest };
  }

  async acceptConnectionRequest(
    model: RespondConnectionRequestDto,
    developerId: string
  ) {
    const updatedRequest = await this.prismaServie.connectionRequest.update({
      data: {
        resolved: true,
        resolvedAt: new Date(),
        successful: true,
      },
      where: {
        id: model.requestId,
      },
    });

    if (!updatedRequest)
      throw new BadRequestException("Could not find that request");

    const connectionList = await this.prismaServie.connectionList.findMany({
      where: {
        developerId: {
          in: [updatedRequest.requesterId, updatedRequest.requestedId],
        },
      },
      select: {
        id: true,
        developerId: true,
      },
    });

    const chat = await this.prismaServie.directMessageChat.create({
      data: {
        participants: {
          connect: [
            { id: connectionList[0].developerId },
            { id: connectionList[1].developerId },
          ],
        },
      },
    });

    await this.prismaServie.connection.createMany({
      data: [
        {
          developerId: connectionList[1].developerId,
          connectListId: connectionList[0].id,
          chatId: chat.id,
        },
        {
          developerId: connectionList[0].developerId,
          connectListId: connectionList[1].id,
          chatId: chat.id,
        },
      ],
    });

    const newConData = await this.prismaServie.developer.findFirst({
      where: {
        id: developerId,
      },
      select: {
        connectionRequests: {
          where: {
            resolved: false,
          },
        },
        connectionList: {
          select: {
            connections: true,
          },
        },
      },
    });

    await this.notifService.createDeveloperNotification({
      developerId: updatedRequest.requesterId,
      referencedDeveloperId: developerId,
      message: "Connection request accepted!",
    });

    return {
      requests: newConData.connectionRequests,
      connections: newConData.connectionList.connections,
    };
  }

  async rejectConnectionRequest(
    model: RespondConnectionRequestDto,
    developerId: string
  ) {
    const request = await this.prismaServie.connectionRequest.findFirst({
      where: {
        id: model.requestId,
        requestedId: developerId,
      },
    });

    if (!request) throw new BadRequestException("Could not find that request");

    const updatedRequest = await this.prismaServie.connectionRequest.update({
      data: {
        resolved: true,
        resolvedAt: new Date(),
        successful: false,
      },
      where: {
        id: model.requestId,
      },
    });

    const newConData = await this.prismaServie.developer.findFirst({
      where: {
        id: developerId,
      },
      select: {
        connectionRequests: {
          where: {
            resolved: false,
          },
        },
        connectionList: {
          select: {
            connections: true,
          },
        },
      },
    });

    return {
      requests: newConData.connectionRequests,
      connections: newConData.connectionList.connections,
    };
  }

  async createConnectionList(developerId: string) {
    const newConnectionList = await this.prismaServie.connectionList.create({
      data: {
        developerId: developerId,
      },
    });

    return newConnectionList;
  }
}
