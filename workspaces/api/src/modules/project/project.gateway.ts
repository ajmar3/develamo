import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { CreateProjectApplicationDto } from "../connection/connection.dtos";
import { IValidatedSocket } from "../sockets/socket.interfaces";
import { ConnectProjectWebsocketDto } from "../sockets/sockets.dtos";
import { WsExceptionFilter, WSValidationPipe } from "../sockets/sockets.pipes";
import { CreateChannelDto, CreateChannelMessageDto } from "./project.dtos";
import { ProjectService } from "./project.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  namespace: "project",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class ProjectGateway {
  constructor(private projectService: ProjectService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage("connected")
  async handleWebsocketConnect(
    client: IValidatedSocket,
    data: ConnectProjectWebsocketDto
  ) {
    const info = await this.projectService.getProjectInfoById(
      data.projectId,
      client.user.id
    );
    client.join(data.projectId);
    client.join(client.user.id);
    client.emit("project-info", info);
  }

  @SubscribeMessage("create-channel")
  async createNewChannel(client: IValidatedSocket, data: CreateChannelDto) {
    const newChannelInfo = await this.projectService.createChannel(
      client.user.id,
      data
    );
    newChannelInfo.participants.forEach((x) => {
      // we do this so we only emit the message to those who have access
      this.server.to(x.id).emit("new-channel", newChannelInfo);
    });
  }

  @SubscribeMessage("open-channel")
  async openChannel(client: IValidatedSocket, id: string) {
    const openChannel = await this.projectService.openChannel(
      client.user.id,
      id
    );
    client.emit("channel-opened", openChannel);
  }

  @SubscribeMessage("create-message")
  async createMessage(client: IValidatedSocket, data: CreateChannelMessageDto) {
    const newMessageInfo = await this.projectService.createMessage(
      client.user.id,
      data
    );
    newMessageInfo.participants.forEach((x) => {
      // we do this so we only emit the message to those who have access
      this.server.to(x.id).emit("new-message", newMessageInfo.message);
    });
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

  @SubscribeMessage("get-project-applications")
  async getProjectApplications(client: IValidatedSocket, projectId: string) {
    const applications = await this.projectService.getProjectApplications(
      client.user.id,
      projectId
    );

    client.emit("project-application-updates", applications);
  }

  @SubscribeMessage("accept-project-application")
  async acceptProjectApplication(
    client: IValidatedSocket,
    applicationId: string
  ) {
    const projectId = await this.projectService.acceptApplication(
      client.user.id,
      applicationId
    );
    const newApplicationInfo = await this.projectService.getProjectApplications(
      client.user.id,
      projectId
    );
    const info = await this.projectService.getProjectInfoById(
      projectId,
      client.user.id
    );

    client.emit("project-application-updates", newApplicationInfo);
    this.server.to(projectId).emit("project-info", info);
  }

  @SubscribeMessage("reject-project-application")
  async rejectProjectApplication(
    client: IValidatedSocket,
    applicationId: string
  ) {
    const projectId = await this.projectService.rejectApplication(
      client.user.id,
      applicationId
    );
    const newApplicationInfo = await this.projectService.getProjectApplications(
      client.user.id,
      projectId
    );

    client.emit("project-application-updates", newApplicationInfo);
  }
}
