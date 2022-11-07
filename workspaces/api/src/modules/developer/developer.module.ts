import { Module } from "@nestjs/common";
import { DeveloperService } from "./developer.service";
import { DeveloperController } from "./developer.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [DeveloperService],
  controllers: [DeveloperController],
  exports: [DeveloperService],
})
export class DeveloperModule {}
