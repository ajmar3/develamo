import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import {
  CreateConnectionRequestDto,
  RespondConnectionRequestDto,
} from "./connection.dtos";
import { ConnectionService } from "./connection.service";
import { WsExceptionFilter, WSValidationPipe } from "../sockets/sockets.pipes";
import { ConnectWebsocketDto } from "../sockets/sockets.dtos";
import { IValidatedSocket } from "../sockets/socket.interfaces";
import { ProjectService } from "../project/project.service";
import { CachingService } from "../caching/caching.service";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: "connection",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class ConnectionGateway implements OnGatewayDisconnect {
  constructor(
    private conService: ConnectionService,
    private projectService: ProjectService,
    private cacheService: CachingService
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: IValidatedSocket) {
    if (client.user)
      await this.cacheService.setUserOffline(client.user.id, "connection");
  }

  @SubscribeMessage("request-connection")
  async requestConnection(
    client: IValidatedSocket,
    data: CreateConnectionRequestDto
  ) {
    const res = await this.conService.createConnectionRequest(
      data,
      client.user.id
    );

    client.emit("new-sent-request", res.request);

    this.server.to(res.request.requestedId).emit("new-connection-request", res);
  }

  @SubscribeMessage("accept-request")
  async acceptRequest(
    client: IValidatedSocket,
    data: RespondConnectionRequestDto
  ) {
    const res = await this.conService.acceptConnectionRequest(
      data,
      client.user.id
    );
    client.emit("connection-request-response", {
      requests: res.requests,
      connections: res.connections,
    });
    for (const particpant of res.chat.participants) {
      this.server.to(particpant.id).emit("new-chat", res.chat);
    }
  }

  @SubscribeMessage("reject-request")
  async rejectRequest(
    client: IValidatedSocket,
    data: RespondConnectionRequestDto
  ) {
    const newConData = await this.conService.rejectConnectionRequest(
      data,
      client.user.id
    );
    client.emit("connection-request-response", newConData);
  }

  @SubscribeMessage("connected")
  async handleWebsocketConnect(
    client: IValidatedSocket,
    data: ConnectWebsocketDto
  ) {
    const connections = await this.conService.getConnectionsForDeveloper(
      client.user.id
    );
    const projectApplications =
      await this.projectService.getProjectApplicationsForDeveloper(
        client.user.id
      );

    client.emit("connection-update", connections);
    client.emit("project-aplication-update", projectApplications);
    client.join(client.user.id);

    await this.cacheService.setUserOnline(client.user.id, "connection");
  }
}
