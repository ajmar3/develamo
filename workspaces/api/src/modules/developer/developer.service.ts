import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DeveloperService {
  constructor(private prismaService: PrismaService) {}

  async getDeveloperByEmail(email: string) {
    return await this.prismaService.developer.findFirst({
      where: {
        email: email,
      },
    });
  }

  async createDeveloper(model: { baseData: any; email: string }) {
    const newDev = await this.prismaService.developer.create({
      data: {
        githubId: model.baseData.id.toString(),
        githubUsername: model.baseData.login,
        name: model.baseData.name,
        avatarURL: model.baseData.avatar_url,
        email: model.email,
        bio: model.baseData.bio,
      },
    });
    return newDev;
  }

  async updateDeveloperOnSignIn(
    model: { baseData: any; email: string },
    developerId: string
  ) {
    const updatedDeveloper = await this.prismaService.developer.update({
      data: {
        avatarURL: model.baseData.avatar_url,
      },
      where: {
        id: developerId,
      },
    });

    return updatedDeveloper;
  }
}
