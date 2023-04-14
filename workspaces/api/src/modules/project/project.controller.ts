import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { IValidatedRequest } from "../auth/auth.interfaces";
import {
  CreateProjectDto,
  CreateProjectSearchRequestDto,
  ProjectFeedDto,
} from "./project.dtos";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get("tags/all")
  async getAllTags() {
    return await this.projectService.getAllTags();
  }

  @Get("my-projects")
  async getMyProjects(@Req() request: IValidatedRequest) {
    return await this.projectService.getMyProjects(request.user.id);
  }

  @Post("project-feed")
  async getProjectFeed(@Body() model: ProjectFeedDto) {
    return await this.projectService.getProjectFeed(model);
  }

  @Post("create")
  async createProject(
    @Body() model: CreateProjectDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.projectService.createProject(model, request.user.id);
  }

  @Post("create-project-search")
  async createProjectSearchRequest(
    @Body() model: CreateProjectSearchRequestDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.projectService.createProjectSearchRequest(
      model,
      request.user.id
    );
  }
}
