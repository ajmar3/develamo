import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ChatService } from "./chat.service";

@Module({
  imports: [DatabaseModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
