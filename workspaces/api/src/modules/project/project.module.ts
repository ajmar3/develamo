import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { ProjectGateway } from "./project.gateway";
import { JwtModule } from "@nestjs/jwt";
import { KanbanService } from "./kanban/kanban.service";
import { KanbanGateway } from "./kanban/kanban.gateway";
import { CachingModule } from "../caching/caching.module";
import { NotificationModule } from "../notification/notification.module";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [DatabaseModule, JwtModule, CachingModule, NotificationModule],
  providers: [ProjectService, ProjectGateway, KanbanService, KanbanGateway],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
