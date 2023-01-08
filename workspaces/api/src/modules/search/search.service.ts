import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SearchDto } from "./search.dtos";

@Injectable()
export class SearchService {
  constructor(private prismaService: PrismaService) {}

  async search(model: SearchDto, developerId: string) {
    const developers = await this.prismaService.developer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: model.input,
              mode: "insensitive",
            },
          },
          {
            githubUsername: {
              contains: model.input,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            id: {
              not: developerId,
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        githubUsername: true,
        avatarURL: true,
      },
    });
    return { developers, projects: [] };
  }
}
