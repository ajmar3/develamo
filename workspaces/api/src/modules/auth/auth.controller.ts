import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { Public } from "./auth.decorators";
import { IValidatedRequest } from "./auth.interfaces";

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
    response.send({ login: "successful" });
  }

  @Get("me")
  async getUserInfo(@Req() request: IValidatedRequest) {
    return await this.authService.getUserInfo(request.user.id);
  }
}
