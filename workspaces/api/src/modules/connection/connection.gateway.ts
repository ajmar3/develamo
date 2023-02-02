import {
  CACHE_MANAGER,
  Inject,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import {
  CreateConnectionRequestDto,
  CreateProjectApplicationDto,
  RespondConnectionRequestDto,
} from "./connection.dtos";
import { ConnectionService } from "./connection.service";
import { WsExceptionFilter, WSValidationPipe } from "../sockets/sockets.pipes";
import { ConnectWebsocketDto } from "../sockets/sockets.dtos";
import { IValidatedSocket } from "../sockets/socket.interfaces";
import { ProjectService } from "../project/project.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: Socket) {
    await this.cacheManager.del(client.id);
  }

  @SubscribeMessage("request-connection")
  async requestConnection(
    client: IValidatedSocket,
    data: CreateConnectionRequestDto
  ) {
    const newConnectionRequest = await this.conService.createConnectionRequest(
      data,
      client.user.id
    );

    client.emit("new-sent-request", newConnectionRequest);

    const recieverClientId = (await this.cacheManager.get(
      data.requestedId
    )) as string;
    if (recieverClientId) {
      this.server
        .to(recieverClientId)
        .emit("new-connection-request", newConnectionRequest);
    }
  }

  @SubscribeMessage("accept-request")
  async acceptRequest(
    client: IValidatedSocket,
    data: RespondConnectionRequestDto
  ) {
    const newConData = await this.conService.acceptConnectionRequest(
      data,
      client.user.id
    );
    client.emit("connection-update", newConData);
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
    client.emit("connection-update", newConData);
  }

  @SubscribeMessage("apply-to-project")
  async applyToProject(
    client: IValidatedSocket,
    data: CreateProjectApplicationDto
  ) {
    const newApplication = await this.projectService.createProjectApplication(
      data,
      client.user.id
    );

    client.emit("new-application", newApplication);
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

    await this.cacheManager.set(
      data.developerId,
      client.id,
      parseInt(process.env.WEBSOCKET_CONNECTION_TTL)
    );
  }
}
