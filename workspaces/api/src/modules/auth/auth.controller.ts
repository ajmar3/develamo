import { HttpService } from "@nestjs/axios";
import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  @Post("oauth")
  async oauthLogin(@Body("code") code: string, @Res() response: Response) {
    const tokenData = await this.authService.getGithubData(code);
    const token = await this.authService.signIn(tokenData);

    response.cookie("Authorization", "Bearer " + token, {
      httpOnly: true,
      path: "/",
    });
    response.send({ login: "successful" });
  }
}
