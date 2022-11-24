import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";

@Module({
  imports: [DatabaseModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
