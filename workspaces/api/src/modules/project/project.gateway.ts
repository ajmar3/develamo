import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { WsGuard } from "../auth/ws.guard";
import { WsExceptionFilter, WSValidationPipe } from "../sockets/sockets.pipes";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  namespace: "chat",
})
@UseGuards(WsGuard)
@UsePipes(new WSValidationPipe())
@UseFilters(new WsExceptionFilter())
export class ProjectGateway {
  @SubscribeMessage("message")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }
}
