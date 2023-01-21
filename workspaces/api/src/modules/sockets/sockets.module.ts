import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatModule } from "../chat/chat.module";
import { ConnectionModule } from "../connection/connection.module";
import { ActionsGateway } from "./actions.gateway";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [ConnectionModule, JwtModule, ChatModule],
  providers: [ActionsGateway, ChatGateway],
})
export class SocketsModule {}
