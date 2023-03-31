import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { ProjectGateway } from "./project.gateway";
import { JwtModule } from "@nestjs/jwt";
import { KanbanService } from "./kanban/kanban.service";
import { KanbanGateway } from "./kanban/kanban.gateway";

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [ProjectService, ProjectGateway, KanbanService, KanbanGateway],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
