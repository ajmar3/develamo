import { CACHE_MANAGER, Inject, UseGuards, UsePipes } from "@nestjs/common";
import { Cache } from "cache-manager";
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { WSValidationPipe } from "./sockets.pipes";
import { IValidatedSocket } from "./socket.interfaces";
import { ChatService } from "../chat/chat.service";
import {
  CreateDirectMessageChatDto,
  NewMessageDto,
  OpenChatDto,
  ViewMessageDto,
} from "../chat/chat.dtos";
import { ConnectWebsocketDto } from "./sockets.dtos";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  namespace: "chat",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
export class ChatGateway implements OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: Socket) {
    await this.cacheManager.del(client.id);
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
    const chatInfo = await this.chatService.getChatInfoForDeveloper(
      client.user.id
    );
    client.join(data.developerId);
    client.emit("new-chat-info", chatInfo);
    return;
  }
}
