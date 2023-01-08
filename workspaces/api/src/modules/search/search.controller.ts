import { Body, Controller, Post, Req } from "@nestjs/common";
import { IValidatedRequest } from "../auth/auth.interfaces";
import { SearchDto } from "./search.dtos";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post("")
  async getSearchResults(
    @Body() model: SearchDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.searchService.search(model, request.user.id);
  }
}
