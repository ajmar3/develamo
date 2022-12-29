import { Body, Controller, Post, Req } from "@nestjs/common";
import { IValidatedRequest } from "../auth/auth.interfaces";
import { DeveloperService } from "./developer.service";

@Controller("developer")
export class DeveloperController {
  constructor(private devService: DeveloperService) {}

  @Post("update")
  async updateDeveloper(
    @Body() model: { name: string; bio: string },
    @Req() request: IValidatedRequest
  ) {
    return await this.devService.updateDeveloper(model, request.user.id);
  }
}
