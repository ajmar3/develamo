import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CreateConnectionRequestDto,
  RespondConnectionRequestDto,
} from "./connection.dtos";

@Injectable()
export class ConnectionService {
  constructor(private prismaServie: PrismaService) {}

  async getConnectionsForDeveloper(developerId: string) {
    const connections = await this.prismaServie.developer.findFirst({
      where: {
        id: developerId,
      },
      select: {
        connectionList: {
          include: {
            connections: true,
          },
        },
      },
    });

    const connectionRequests =
      await this.prismaServie.connectionRequest.findMany({
        where: {
          requestedId: developerId,
          resolved: false,
        },
      });

    return {
      connections: connections.connectionList,
      requests: connectionRequests,
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

    const newConnectionRequest =
      await this.prismaServie.connectionRequest.create({
        data: {
          requesterId: developerId,
          requestedId: model.requestedId,
        },
      });

    return newConnectionRequest;
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

    const connectionList = await this.prismaServie.connectionList.findFirst({
      where: {
        developerId: updatedRequest.requesterId,
      },
      select: {
        id: true,
      },
    });

    const newConnection = await this.prismaServie.connection.create({
      data: {
        developerId: developerId,
        connectListId: connectionList.id,
      },
    });

    return newConnection;
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

    return updatedRequest;
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
