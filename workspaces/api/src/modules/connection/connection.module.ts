import { Module } from "@nestjs/common";
import { ConnectionService } from "./connection.service";
import { ConnectionController } from "./connection.controller";
import { DatabaseModule } from "../database/database.module";
import { ConnectionGateway } from "./connection.gateway";
import { ProjectModule } from "../project/project.module";
import { JwtModule } from "@nestjs/jwt";
import { CachingModule } from "../caching/caching.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    DatabaseModule,
    ProjectModule,
    JwtModule,
    CachingModule,
    NotificationModule,
  ],
  providers: [ConnectionService, ConnectionGateway],
  controllers: [ConnectionController],
  exports: [ConnectionService],
})
export class ConnectionModule {}
