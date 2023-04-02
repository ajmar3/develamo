import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { CachingModule } from "../caching/caching.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [DatabaseModule, JwtModule, CachingModule, NotificationModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
