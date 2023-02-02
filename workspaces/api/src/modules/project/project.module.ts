import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { ProjectGateway } from "./project.gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [ProjectService, ProjectGateway],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
