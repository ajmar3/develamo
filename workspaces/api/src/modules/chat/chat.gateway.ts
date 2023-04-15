import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { WsExceptionFilter, WSValidationPipe } from "../sockets/sockets.pipes";
import { IValidatedSocket } from "../sockets/socket.interfaces";
import { ChatService } from "./chat.service";
import {
  CreateDirectMessageChatDto,
  NewMessageDto,
  OpenChatDto,
  ViewMessageDto,
} from "./chat.dtos";
import { ConnectWebsocketDto } from "../sockets/sockets.dtos";
import { CachingService } from "../caching/caching.service";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: "chat",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class ChatGateway implements OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private cacheService: CachingService
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: IValidatedSocket) {
    if (client.user)
      await this.cacheService.setUserOffline(client.user.id, "chat");
  }

  @SubscribeMessage("create-direct-message-chat")
  async createDirectMessageChat(
    client: IValidatedSocket,
    data: CreateDirectMessageChatDto
  ) {
    const newChatInfo = await this.chatService.createDirectMessageChat(
      data,
      client.user.id
    );

    client.emit("new-chat", newChatInfo);
  }

  @SubscribeMessage("new-message")
  async createDirectMessage(client: IValidatedSocket, data: NewMessageDto) {
    const newChatInfo = await this.chatService.createDirectMessage(
      data,
      client.user.id
    );

    client.emit("message-updates", {
      chatId: data.chatId,
      newMessages: newChatInfo.messages,
    });

    const otherDeveloper = newChatInfo.participants.find(
      (x) => x.id != client.user.id
    );

    this.server.to(otherDeveloper.id).emit("message-updates", {
      chatId: data.chatId,
      newMessages: newChatInfo.messages,
    });
  }

  @SubscribeMessage("open-chat")
  async openChat(client: IValidatedSocket, data: OpenChatDto) {
    const chatInfo = await this.chatService.getDirectMessageChatInfo(
      data.chatId
    );
    client.join(chatInfo.id);
    client.emit("chat-opened", chatInfo);
  }

  @SubscribeMessage("view-direct-message")
  async viewDirectMessage(client: IValidatedSocket, data: ViewMessageDto) {
    const newChatInfo = await this.chatService.viewDirectMessage(
      client.user.id,
      data
    );
    this.server.to(data.chatId).emit("message-viewed-updates", {
      chatId: data.chatId,
      newMessages: newChatInfo.messages,
    });
  }

  @SubscribeMessage("connected")
  async handleWebsocketConnect(
    client: IValidatedSocket,
    data: ConnectWebsocketDto
  ) {
    await this.cacheService.setUserOnline(client.user.id, "chat");
    const chatInfo = await this.chatService.getChatInfoForDeveloper(
      client.user.id
    );
    client.join(data.developerId);
    client.emit("new-chat-info", chatInfo);
    return;
  }
}
