import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Developer } from "@prisma/client";
import { CreateProjectApplicationDto } from "../connection/connection.dtos";
import { PrismaService } from "../database/prisma.service";
import { CreateProjectDto, ProjectFeedDto } from "./project.dtos";

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async getAllTags() {
    return await this.prismaService.tag.findMany();
  }

  async getProjectFeed(model: ProjectFeedDto) {
    const projects = await this.prismaService.project.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          likes: {
            _count: "desc",
          },
        },
      ],
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
        repoURL: true,
        likes: {
          select: {
            developerId: true,
          },
        },
      },
      skip: model.offset,
      take: 10,
    });

    return projects;
  }

  async getMyProjects(developerId) {
    const owned = await this.prismaService.developer.findFirst({
      where: {
        id: developerId,
      },
      select: {
        ownedProjects: {
          select: {
            title: true,
            tags: true,
            id: true,
            description: true,
            createdAt: true,
            finished: true,
            finishedAt: true,
            developers: {
              select: {
                avatarURL: true,
                id: true,
                name: true,
                githubUsername: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
          },
        },
        projects: {
          select: {
            title: true,
            tags: true,
            id: true,
            description: true,
            createdAt: true,
            finished: true,
            finishedAt: true,
            developers: {
              select: {
                avatarURL: true,
                id: true,
                name: true,
                githubUsername: true,
              },
            },
            owner: {
              select: {
                avatarURL: true,
                id: true,
                name: true,
                githubUsername: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return {
      ownedProjects: owned.ownedProjects,
      projects: owned.projects,
    };
  }

  async createProject(model: CreateProjectDto, developerId: string) {
    const currentDeveloperProjects = await this.prismaService.project.findMany({
      where: {
        ownerId: developerId,
      },
    });

    if (
      currentDeveloperProjects.some(
        (x) => x.title.toLowerCase() == model.title.toLowerCase()
      )
    )
      throw new BadRequestException(
        "You already have a project with that name"
      );

    if (currentDeveloperProjects.filter((x) => x.finished == false).length > 3)
      throw new BadRequestException(
        "You can only have 3 active projects at once"
      );

    const connectRecord = model.tagIds.map((x) => ({
      id: x,
    }));

    const newProject = await this.prismaService.project.create({
      data: {
        ownerId: developerId,
        title: model.title,
        description: model.description,
        tags: {
          connect: connectRecord,
        },
        repoURL: model.repoURL,
      },
    });

    return newProject.id;
  }

  async getProjectById(projectId: string, developerId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        developers: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
        owner: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
      },
    });

    if (!project)
      throw new BadRequestException("could not find project with that Id");

    if (
      !(
        project.developers.find((x) => x.id == developerId) ||
        project.owner.id == developerId
      )
    ) {
      throw new UnauthorizedException(
        "You are not authorised for this project"
      );
    }

    return project;
  }

  async getProjectApplicationsForDeveloper(developerId: string) {
    const projectApplications =
      await this.prismaService.projectApplication.findMany({
        where: {
          requesterId: developerId,
          resolved: false,
        },
      });
    return projectApplications;
  }

  async createProjectApplication(
    data: CreateProjectApplicationDto,
    developerId: string
  ) {
    const existingApplication =
      await this.prismaService.projectApplication.findFirst({
        where: {
          requesterId: developerId,
          projectId: data.projectId,
        },
        select: {
          id: true,
        },
      });

    if (existingApplication)
      throw new BadRequestException("You have already applied to that project");

    const newApplication = await this.prismaService.projectApplication.create({
      data: {
        projectId: data.projectId,
        requesterId: developerId,
      },
    });

    return newApplication;
  }
}
