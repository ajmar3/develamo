import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { WsGuard } from "src/modules/auth/ws.guard";
import { IValidatedSocket } from "src/modules/sockets/socket.interfaces";
import {
  WsExceptionFilter,
  WSValidationPipe,
} from "src/modules/sockets/sockets.pipes";
import {
  ConnectKanbanWebsocketDto,
  CreateTicketDto,
  CreateTicketListDto,
  ReorderTicketListDto,
  ReorderTicketDto,
  EditTicketListDto,
  EditTicketDto,
  DeleteTicketDto,
  DeleteTicketListDto,
} from "./kanban.dto";
import { KanbanService } from "./kanban.service";
import { CachingService } from "src/modules/caching/caching.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  namespace: "kanban",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class KanbanGateway {
  constructor(
    private kanbanService: KanbanService,
    private cacheService: CachingService
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage("connected")
  async handleWebsocketConnect(
    client: IValidatedSocket,
    data: ConnectKanbanWebsocketDto
  ) {
    const info = await this.kanbanService.getProjectTicketLists(
      data.projectId,
      client.user.id
    );
    client.join("kanban-" + data.projectId);
    client.emit("ticket-list-info", info);
    client.emit("connected");

    await this.cacheService.setUserOnline(client.user.id, "kanban");
  }

  @SubscribeMessage("create-ticket-list")
  async createTicketList(client: IValidatedSocket, data: CreateTicketListDto) {
    const newListInfo = await this.kanbanService.createTicketList(
      data,
      client.user.id
    );

    this.server
      .to("kanban-" + data.projectId)
      .emit("ticket-list-info", newListInfo);
  }

  @SubscribeMessage("create-ticket")
  async createTicket(client: IValidatedSocket, data: CreateTicketDto) {
    const newListInfo = await this.kanbanService.createTicket(
      data,
      client.user.id
    );

    this.server
      .to("kanban-" + data.projectId)
      .emit("update-ticket-list", newListInfo);
  }

  @SubscribeMessage("reorder-ticket")
  async reorderTicket(client: IValidatedSocket, data: ReorderTicketDto) {
    const newListInfo = await this.kanbanService.reorderTicket(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + data.projectId)
      .emit("ticket-list-info", newListInfo);
  }

  @SubscribeMessage("reorder-ticket-list")
  async reorderTicketList(
    client: IValidatedSocket,
    data: ReorderTicketListDto
  ) {
    const newListInfo = await this.kanbanService.reorderTicketList(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + data.projectId)
      .emit("ticket-list-info", newListInfo);
  }

  @SubscribeMessage("edit-ticket-list")
  async editTicketList(client: IValidatedSocket, data: EditTicketListDto) {
    const newListInfo = await this.kanbanService.editTicketList(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + newListInfo.projectId)
      .emit("ticket-list-edit", newListInfo);
  }

  @SubscribeMessage("edit-ticket")
  async editTicket(client: IValidatedSocket, data: EditTicketDto) {
    const newTicketInfo = await this.kanbanService.editTicket(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + newTicketInfo.project.id)
      .emit("ticket-edit", newTicketInfo);
  }

  @SubscribeMessage("delete-ticket")
  async deleteTicket(client: IValidatedSocket, data: DeleteTicketDto) {
    const newListInfo = await this.kanbanService.deleteTicket(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + newListInfo.projectId)
      .emit("ticket-list-edit", newListInfo);
  }

  @SubscribeMessage("delete-ticket-list")
  async deleteTicketList(client: IValidatedSocket, data: DeleteTicketListDto) {
    const newListInfo = await this.kanbanService.deleteTicketList(
      data,
      client.user.id
    );
    this.server
      .to("kanban-" + data.projectId)
      .emit("ticket-list-info", newListInfo);
  }
}
