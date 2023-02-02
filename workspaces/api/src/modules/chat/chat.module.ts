import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
