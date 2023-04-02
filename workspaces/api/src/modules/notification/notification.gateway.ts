import {
  UseGuards,
  UsePipes,
  UseFilters,
  Inject,
  forwardRef,
} from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from "@nestjs/websockets";
import { WsGuard } from "../auth/ws.guard";
import { WSValidationPipe, WsExceptionFilter } from "../sockets/sockets.pipes";
import { IValidatedSocket } from "../sockets/socket.interfaces";
import {
  GetNotificationDto,
  MarkNotificationAsReadDto,
} from "./notification.dto";
import { NotificationService } from "./notification.service";
import { CachingService } from "../caching/caching.service";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  namespace: "notification",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class NotificationGateway implements OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notifService: NotificationService,
    private cacheService: CachingService
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: IValidatedSocket) {
    if (client.user) {
      client.leave(client.user.id);
      await this.cacheService.setUserOffline(client.user.id, "notification");
    }
  }

  @SubscribeMessage("connected")
  async handleNotificationConnect(client: IValidatedSocket) {
    const myNotifications = await this.notifService.getNotifications(
      client.user.id
    );
    client.emit("notifications-info", myNotifications);
    client.join(client.user.id);
    await this.cacheService.setUserOnline(client.user.id, "notification");
  }

  @SubscribeMessage("mark-notification-as-seen")
  async markNotificationAsSeen(
    client: IValidatedSocket,
    data: MarkNotificationAsReadDto
  ) {
    const updatedNotification = await this.notifService.markNotificationAsRead(
      data.notificationId,
      client.user.id
    );
    client.emit("updated-notification", updatedNotification);
  }

  async sendNotification(developerId: string, notification: any) {
    this.server.to(developerId).emit("new-notification", notification);
  }
}
