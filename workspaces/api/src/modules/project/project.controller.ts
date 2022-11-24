import { Controller, Get } from "@nestjs/common";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get("tags/all")
  async getAllTags() {
    return await this.projectService.getAllTags();
  }
}
