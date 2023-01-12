import { Injectable } from "@nestjs/common";
import { Project } from "@prisma/client";
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

    const matchingTag = await this.prismaService.tag.findFirst({
      where: {
        title: {
          equals: model.input,
          mode: "insensitive",
        },
      },
    });

    let projects: any[] = [];
    if (matchingTag) {
      projects = await this.prismaService.project.findMany({
        where: {
          tags: {
            some: {
              id: matchingTag.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          description: true,
          title: true,
          finished: true,
          finishedAt: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              avatarURL: true,
            },
          },
          developers: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              avatarURL: true,
            },
          },
          tags: {
            select: {
              id: true,
              title: true,
            },
          },
          likes: {
            select: {
              developerId: true,
            },
          },
        },
      });
    } else {
      projects = await this.prismaService.project.findMany({
        where: {
          OR: [
            {
              title: {
                contains: model.input,
              },
            },
            {
              description: {
                contains: model.input,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          description: true,
          title: true,
          finished: true,
          finishedAt: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              avatarURL: true,
            },
          },
          developers: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              avatarURL: true,
            },
          },
          tags: {
            select: {
              id: true,
              title: true,
            },
          },
          likes: {
            select: {
              developerId: true,
            },
          },
        },
      });
    }

    return { developers, projects: projects };
  }
}
