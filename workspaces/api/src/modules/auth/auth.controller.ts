import { HttpService } from "@nestjs/axios";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { Public } from "./auth.decorators";
import { IValidatedRequest } from "./auth.interfaces";
import { AuthRolesEnum } from "./auth.enums";
import {
  AdminLoginDto,
  AdminTokenGenerateDto,
  VerifyTokenDto,
} from "./auth.dtos";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("oauth")
  async oauthLogin(
    @Body("code") code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const tokenData = await this.authService.getGithubData(code);
    const token = await this.authService.signIn(tokenData);
    response.cookie("Authorization", token, {
      httpOnly: true,
      path: "/",
    });
    response.set("Access-Control-Expose-Headers", "Set-Cookie");
    response.send({ login: "successful" });
  }

  @Get("me")
  async getUserInfo(@Req() request: IValidatedRequest) {
    return await this.authService.getUserInfo(request.user.id);
  }

  @Get("project/:id/me")
  async verifyUserForProject(
    @Req() request: IValidatedRequest,
    @Param("id") id: string
  ) {
    return await this.authService.verifyUserForProject(request.user.id, id);
  }

  @Post("admin-generate-token")
  async generateTokenForUser(
    @Body() model: AdminTokenGenerateDto,
    @Req() request: IValidatedRequest
  ) {
    if ((request.user.role as any) != AuthRolesEnum.ADMIN)
      throw new UnauthorizedException("Only admins can access this command");

    return await this.authService.adminGenerateToken(model);
  }

  @Post("admin-login")
  async adminLogin(@Body() model: AdminLoginDto) {
    return await this.authService.adminLogin(model);
  }

  @Public()
  @Post("verify-token")
  async verifyToken(@Body() model: VerifyTokenDto) {
    return await this.authService.verifyToken(model);
  }
}
