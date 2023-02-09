import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { lastValueFrom } from "rxjs";
import { ConnectionService } from "../connection/connection.service";
import { DeveloperService } from "../developer/developer.service";
import { ProjectService } from "../project/project.service";
import { AdminLoginDto, AdminTokenGenerateDto } from "./auth.dtos";
import { AuthRolesEnum } from "./auth.enums";

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private developerService: DeveloperService,
    private conService: ConnectionService,
    private jwtService: JwtService,
    private projectService: ProjectService
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

    if (!developer) {
      developer = await this.developerService.createDeveloper(model);
      await this.conService.createConnectionList(developer.id);
    } else
      developer = await this.developerService.updateDeveloperOnSignIn(
        model,
        developer.id
      );

    const payload = {
      id: developer.id,
      role: AuthRolesEnum.DEVELOPER,
    };

    return await this.jwtService.signAsync(payload);
  }

  async getUserInfo(developerId: string) {
    return await this.developerService.getDeveloperById(developerId);
  }

  async adminGenerateToken(model: AdminTokenGenerateDto) {
    const developer = await this.developerService.getDeveloperByEmail(
      model.userEmail
    );

    if (!developer) throw new BadRequestException("Could not find that user");

    return await this.jwtService.signAsync({
      id: developer.id,
      role: AuthRolesEnum.DEVELOPER,
    });
  }

  async adminLogin(model: AdminLoginDto) {
    if (
      model.email != process.env.ADMIN_EMAIL ||
      model.password != process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException("Admin email or password is wrong");
    }

    const adminUser = await this.developerService.getDeveloperByEmail(
      model.email
    );

    return await this.jwtService.signAsync({
      id: adminUser.id,
      role: AuthRolesEnum.ADMIN,
    });
  }

  async verifyUserForProject(developerId: string, projectId: string) {
    const developer = await this.developerService.getDeveloperById(developerId);

    const project = await this.projectService.getProjectInfoById(
      projectId,
      developer.id
    );

    return {
      developer: developer,
      project: project,
    };
  }

  async userProjectCheck(developerId: string, projectId: string) {
    const project = await this.projectService.getProjectInfoById(
      projectId,
      developerId
    );
  }
}
