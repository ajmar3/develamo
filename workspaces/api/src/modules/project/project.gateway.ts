import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
  OnGatewayDisconnect,
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
import {
  CreateChannelDto,
  CreateChannelMessageDto,
  EditProjectDto,
  LikeProjectDto,
  RemoveDeveloperDto,
} from "./project.dtos";
import { ProjectService } from "./project.service";
import { CachingService } from "../caching/caching.service";
import { SearchService } from "../search/search.service";

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
export class ProjectGateway implements OnGatewayDisconnect {
  constructor(
    private projectService: ProjectService,
    private cacheService: CachingService
  ) {}

  async handleDisconnect(client: IValidatedSocket) {
    if (client.user) {
      client.leave(client.user.id);
      await this.cacheService.setUserOffline(client.user.id, "project");
    }
  }

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

    await this.cacheService.setUserOnline(client.user.id, "project");
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
    const application = await this.projectService.createProjectApplication(
      data,
      client.user.id
    );

    client.emit("new-application", application);
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

  @SubscribeMessage("leave-project")
  async leaveProject(client: IValidatedSocket, projectId: string) {
    const projectTitle = await this.projectService.leaveProject(
      client.user.id,
      projectId
    );
    client.emit("left-project", projectTitle);
  }

  @SubscribeMessage("delete-project")
  async deleteProject(client: IValidatedSocket, projectId: string) {
    const projectTitle = await this.projectService.deleteProject(
      client.user.id,
      projectId
    );
    this.server.to(projectId).emit("project-deleted", projectTitle);
  }

  @SubscribeMessage("edit-project-info")
  async editProjectInfo(client: IValidatedSocket, data: EditProjectDto) {
    const newProjectInfo = await this.projectService.editProjectInfo(
      data,
      client.user.id
    );
    client.emit("project-edited", newProjectInfo);
  }

  @SubscribeMessage("remove-developer-from-project")
  async removeDeveloperFromProject(
    client: IValidatedSocket,
    data: RemoveDeveloperDto
  ) {
    const newTeamInfo = await this.projectService.removeDeveloperFromProject(
      client.user.id,
      data
    );
    this.server
      .to(data.developerId)
      .emit("removed-from-project", data.developerId);
    this.server.to(data.projectId).emit("updated-developer-list", newTeamInfo);
  }

  @SubscribeMessage("like-project")
  async likeProject(client: IValidatedSocket, data: LikeProjectDto) {
    const updatedLikeInfo = await this.projectService.likeProject(
      data,
      client.user.id
    );

    client.emit("updated-project-likes", updatedLikeInfo);
  }

  @SubscribeMessage("unlike-project")
  async unlikeProject(client: IValidatedSocket, data: LikeProjectDto) {
    const updatedLikeInfo = await this.projectService.unlikeProject(
      data,
      client.user.id
    );

    client.emit("updated-project-likes", updatedLikeInfo);
  }
}
