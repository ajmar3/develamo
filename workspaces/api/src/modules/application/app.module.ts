import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ChatModule } from "../chat/chat.module";
import { ConnectionModule } from "../connection/connection.module";
import { DatabaseModule } from "../database/database.module";
import { DeveloperModule } from "../developer/developer.module";
import { ProjectModule } from "../project/project.module";
import { SearchModule } from "../search/search.module";
import { NotificationModule } from "../notification/notification.module";
import type { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    DeveloperModule,
    ProjectModule,
    ConnectionModule,
    SearchModule,
    ChatModule,
    NotificationModule,
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
