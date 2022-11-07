import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { lastValueFrom } from "rxjs";
import { DeveloperService } from "../developer/developer.service";
import { AuthRolesEnum } from "./auth.enums";

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private developerService: DeveloperService,
    private jwtService: JwtService
  ) {}

  async getGithubData(code: string) {
    const tokenData = await lastValueFrom(
      this.httpService.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
    );

    let baseData: any;
    if (tokenData.data.access_token) {
      baseData = await lastValueFrom(
        this.httpService.get("https://api.github.com/user", {
          headers: {
            Authorization: "token " + tokenData.data.access_token,
          },
        })
      );
    }

    let emailData: any;
    if (tokenData.data.access_token) {
      emailData = await lastValueFrom(
        this.httpService.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: "token " + tokenData.data.access_token,
          },
        })
      );
    }

    if (!baseData || !emailData)
      throw new UnauthorizedException("Github authentication failed");

    return {
      baseData: baseData.data,
      email: emailData.data.find((x) => x.primary == true).email,
    };
  }

  async signIn(model: { baseData: any; email: string }) {
    let developer = await this.developerService.getDeveloperByEmail(
      model.email
    );

    if (!developer)
      developer = await this.developerService.createDeveloper(model);
    else
      developer = await this.developerService.updateDeveloperOnSignIn(
        model,
        developer.id
      );

    const payload = {
      developerId: developer.id,
      email: developer.email,
      role: AuthRolesEnum.DEVELOPER,
      username: developer.githubUsername,
      pictureURL: developer.avatarURL,
    };

    return await this.jwtService.signAsync(payload);
  }
}
