import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Developer } from "@prisma/client";
import { CreateProjectApplicationDto } from "../connection/connection.dtos";
import { PrismaService } from "../database/prisma.service";
import {
  CreateChannelDto,
  CreateChannelMessageDto,
  CreateProjectDto,
  ProjectFeedDto,
} from "./project.dtos";

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
        chat: {
          create: {},
        },
      },
      select: {
        id: true,
        chat: {
          select: {
            id: true,
          },
        },
      },
    });

    await this.prismaService.projectChatChannel.create({
      data: {
        projectId: newProject.id,
        chatId: newProject.chat.id,
        name: "General",
        participants: {
          connect: {
            id: developerId,
          },
        },
        admins: {
          connect: {
            id: developerId,
          },
        },
      },
    });

    return newProject.id;
  }

  async getProjectInfoById(projectId: string, developerId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        title: true,
        chat: {
          select: {
            id: true,
            channels: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                participants: {
                  select: {
                    id: true,
                    githubUsername: true,
                    name: true,
                    avatarURL: true,
                  },
                },
                admins: {
                  select: {
                    id: true,
                    githubUsername: true,
                    name: true,
                    avatarURL: true,
                  },
                },
                messages: {
                  select: {
                    channelId: true,
                    sentAt: true,
                    sender: {
                      select: {
                        id: true,
                        githubUsername: true,
                        name: true,
                        avatarURL: true,
                      },
                    },
                    seenBy: {
                      select: {
                        id: true,
                      },
                    },
                  },
                  orderBy: {
                    sentAt: "desc",
                  },
                  take: 1,
                },
              },
              orderBy: {
                createdAt: "asc",
              },
              where: {
                participants: {
                  some: {
                    id: developerId,
                  },
                },
              },
            },
          },
        },
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

  async createChannel(developerId: string, data: CreateChannelDto) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        ownerId: true,
        chat: {
          select: {
            id: true,
            channels: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (project.chat.channels.map((x) => x.name).includes(data.name)) {
      throw new BadRequestException("Chat with that name already exists");
    }

    if (project.ownerId == developerId) {
      const newChannel = await this.prismaService.projectChatChannel.create({
        data: {
          projectId: data.projectId,
          chatId: project.chat.id,
          name: data.name,
          participants: {
            connect: {
              id: developerId,
            },
          },
          admins: {
            connect: {
              id: developerId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          participants: {
            select: {
              id: true,
              githubUsername: true,
              name: true,
              avatarURL: true,
            },
          },
          admins: {
            select: {
              id: true,
              githubUsername: true,
              name: true,
              avatarURL: true,
            },
          },
          messages: {
            select: {
              sentAt: true,
              sender: {
                select: {
                  id: true,
                  githubUsername: true,
                  name: true,
                  avatarURL: true,
                },
              },
              seenBy: {
                select: {
                  id: true,
                },
              },
            },
            orderBy: {
              sentAt: "desc",
            },
            take: 1,
          },
        },
      });
      return newChannel;
    } else {
      const newChannel = await this.prismaService.projectChatChannel.create({
        data: {
          projectId: data.projectId,
          chatId: project.chat.id,
          name: data.name,
          participants: {
            connect: [
              {
                id: developerId,
              },
              {
                id: project.ownerId,
              },
            ],
          },
          admins: {
            connect: [
              {
                id: developerId,
              },
              {
                id: project.ownerId,
              },
            ],
          },
        },
        select: {
          id: true,
          name: true,
          participants: {
            select: {
              id: true,
              githubUsername: true,
              name: true,
              avatarURL: true,
            },
          },
          admins: {
            select: {
              id: true,
              githubUsername: true,
              name: true,
              avatarURL: true,
            },
          },
          messages: {
            select: {
              sentAt: true,
              sender: {
                select: {
                  id: true,
                  githubUsername: true,
                  name: true,
                  avatarURL: true,
                },
              },
              seenBy: {
                select: {
                  id: true,
                },
              },
            },
            orderBy: {
              sentAt: "desc",
            },
            take: 1,
          },
        },
      });

      return newChannel;
    }
  }

  async openChannel(developerId: string, channelId: string) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        name: true,
        participants: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
        admins: {
          select: {
            id: true,
            githubUsername: true,
            name: true,
            avatarURL: true,
          },
        },
        messages: {
          select: {
            id: true,
            sentAt: true,
            sender: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
            seenBy: {
              select: {
                id: true,
              },
            },
            text: true,
          },
          orderBy: {
            sentAt: "desc",
          },
        },
      },
    });

    if (!channel) {
      throw new BadRequestException("Could not find that channel");
    }

    if (!channel.participants.some((x) => x.id == developerId)) {
      throw new UnauthorizedException("You do not have access to that channel");
    }

    return channel;
  }

  async createMessage(developerId: string, data: CreateChannelMessageDto) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!channel) throw new BadRequestException("Could not find channel");

    if (!channel.participants.some((x) => x.id == developerId)) {
      throw new UnauthorizedException("You do not have access to this channel");
    }

    const newMessage = await this.prismaService.projectChatMessage.create({
      data: {
        senderId: developerId,
        seenBy: {
          connect: {
            id: developerId,
          },
        },
        text: data.text,
        channelId: data.channelId,
      },
      select: {
        id: true,
        channelId: true,
        text: true,
        sender: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarURL: true,
          },
        },
        sentAt: true,
        seenBy: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      message: newMessage,
      participants: channel.participants,
    };
  }
}
