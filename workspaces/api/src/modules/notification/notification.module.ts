import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { DatabaseModule } from "../database/database.module";
import { NotificationGateway } from "./notification.gateway";
import { CachingModule } from "../caching/caching.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
  imports: [DatabaseModule, CachingModule, JwtModule],
})
export class NotificationModule {}
