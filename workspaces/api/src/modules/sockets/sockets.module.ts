import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatModule } from "../chat/chat.module";
import { ConnectionModule } from "../connection/connection.module";
import { ProjectModule } from "../project/project.module";
import { ActionsGateway } from "./actions.gateway";
import { ChatGateway } from "./chat.gateway";
import { ProjectGateway } from "./project.gateway";

@Module({
  imports: [ConnectionModule, JwtModule, ChatModule, ProjectModule],
  providers: [ActionsGateway, ChatGateway, ProjectGateway],
})
export class SocketsModule {}
