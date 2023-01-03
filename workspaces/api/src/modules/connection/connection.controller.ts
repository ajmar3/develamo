import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { IValidatedRequest } from "../auth/auth.interfaces";
import {
  CreateConnectionRequestDto,
  RespondConnectionRequestDto,
} from "./connection.dtos";
import { ConnectionService } from "./connection.service";

@Controller("connection")
export class ConnectionController {
  constructor(private conService: ConnectionService) {}

  @Get("my-connections")
  async getConnections(@Req() request: IValidatedRequest) {
    return await this.conService.getConnectionsForDeveloper(request.user.id);
  }

  @Post("create-request")
  async createConnectionRequest(
    @Body() model: CreateConnectionRequestDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.conService.createConnectionRequest(
      model,
      request.user.id
    );
  }

  @Post("accept-request")
  async acceptConnectionRequest(
    @Body() model: RespondConnectionRequestDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.conService.acceptConnectionRequest(
      model,
      request.user.id
    );
  }

  @Post("reject-request")
  async rejectConnectionRequest(
    @Body() model: RespondConnectionRequestDto,
    @Req() request: IValidatedRequest
  ) {
    return await this.conService.rejectConnectionRequest(
      model,
      request.user.id
    );
  }
}
