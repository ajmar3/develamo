import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateProjectApplicationDto } from "../connection/connection.dtos";
import { PrismaService } from "../database/prisma.service";
import {
  AddToChannelDto,
  CreateChannelDto,
  CreateChannelMessageDto,
  CreateProjectDto,
  CreateProjectSearchRequestDto,
  DeleteLeaveChannelDto,
  EditChannelDto,
  EditProjectDto,
  LikeProjectDto,
  ProjectFeedDto,
  RemoveDeveloperDto,
} from "./project.dtos";
import { NotificationService } from "../notification/notification.service";
import { Cron } from "@nestjs/schedule";
import { CachingService } from "../caching/caching.service";

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    private notifService: NotificationService,
    private cachingService: CachingService
  ) {}

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
        projectSearchRequestAns: {
          select: {
            id: true,
            createdAt: true,
            project: {
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
          },
        },
      },
    });

    return owned;
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
        description: true,
        repoURL: true,
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
    const project = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!project) throw new BadRequestException("could not find that project");

    const existingApplication =
      await this.prismaService.projectApplication.findFirst({
        where: {
          requesterId: developerId,
          projectId: data.projectId,
          resolved: false,
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

    await this.notifService.createProjectNotification({
      developerId: project.ownerId,
      referencedProjectId: project.id,
      message: "Someone has requested to join your project",
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
        id: true,
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

      if (developerId != project.ownerId) {
        await this.notifService.createProjectNotification({
          developerId: project.ownerId,
          referencedProjectId: project.id,
          message: "Someone has added you to a channel!",
        });
      }

      return newChannel;
    }
  }

  async openChannel(developerId: string, channelId: string) {
    let channel = await this.cachingService.getChannelInfoFromCache(channelId);

    if (!channel) {
      channel = await this.prismaService.projectChatChannel.findFirst({
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

      await this.cachingService.writeChannelInfoToCache(channel.id, channel);
    }

    if (!channel.participants.some((x) => x.id == developerId)) {
      throw new UnauthorizedException("You do not have access to that channel");
    }

    return channel;
  }

  async createMessage(developerId: string, data: CreateChannelMessageDto) {
    let channel = await this.cachingService.getChannelInfoFromCache(
      data.channelId
    );

    if (!channel) {
      channel = await this.prismaService.projectChatChannel.findFirst({
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
    }

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

    await this.cachingService.addMessageToChannel(data.channelId, newMessage);

    return {
      message: newMessage,
      participants: channel.participants,
    };
  }

  async getProjectApplications(developerId: string, projectId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        ownerId: true,
        applications: {
          select: {
            id: true,
            createdAt: true,
            requester: {
              select: {
                avatarURL: true,
                githubUsername: true,
                id: true,
                name: true,
                bio: true,
              },
            },
          },
          where: {
            resolved: false,
          },
        },
      },
    });

    if (!project) throw new BadRequestException("Could not find that project");

    if (project.ownerId != developerId) {
      throw new UnauthorizedException("You do not have access to this project");
    }

    return project.applications;
  }

  async acceptApplication(developerId: string, applicationId: string) {
    const application = await this.prismaService.projectApplication.findFirst({
      where: {
        id: applicationId,
      },
      select: {
        id: true,
        resolved: true,
        project: {
          select: {
            id: true,
            ownerId: true,
          },
        },
        requesterId: true,
      },
    });
    if (!application) {
      throw new BadRequestException("Could not find that application");
    }

    if (application.project.ownerId != developerId) {
      throw new UnauthorizedException("You do not own that project");
    }

    if (application.resolved) {
      throw new BadRequestException("Application has been resolved");
    }

    const project = await this.prismaService.project.findFirst({
      where: {
        id: application.project.id,
      },
      select: {
        id: true,
        developers: {
          select: {
            id: true,
          },
        },
      },
    });

    if (project.developers.some((x) => x.id == developerId)) {
      throw new BadRequestException("Developer already in project.");
    }

    await this.prismaService.project.update({
      where: {
        id: application.project.id,
      },
      data: {
        developers: {
          connect: [...project.developers, { id: application.requesterId }],
        },
      },
    });

    await this.prismaService.projectApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        successful: true,
      },
    });

    const generalChannel =
      await this.prismaService.projectChatChannel.findFirst({
        where: {
          projectId: application.project.id,
          name: "General",
        },
        select: {
          id: true,
          participants: {
            select: {
              id: true,
            },
          },
        },
      });

    await this.prismaService.projectChatChannel.update({
      where: {
        id: generalChannel.id,
      },
      data: {
        participants: {
          connect: [
            ...generalChannel.participants,
            { id: application.requesterId },
          ],
        },
      },
    });

    await this.notifService.createProjectNotification({
      developerId: application.requesterId,
      referencedProjectId: project.id,
      message: "You have been added to a project!",
    });

    return application.project.id;
  }

  async rejectApplication(developerId: string, applicationId: string) {
    const application = await this.prismaService.projectApplication.findFirst({
      where: {
        id: applicationId,
      },
      select: {
        id: true,
        resolved: true,
        project: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!application) {
      throw new BadRequestException("Could not find that application");
    }

    if (application.project.ownerId != developerId) {
      throw new UnauthorizedException("You do not own that project");
    }

    if (application.resolved) {
      throw new BadRequestException("Application has been resolved");
    }

    await this.prismaService.projectApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        successful: false,
      },
    });

    return application.project.id;
  }

  async leaveProject(developerId: string, projectId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        title: true,
        developers: {
          select: {
            id: true,
          },
        },
        ownerId: true,
        channels: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!project) throw new BadRequestException("Could not find that project");

    if (project.ownerId == developerId)
      throw new BadRequestException("Cannot leave a project you own");

    if (!project.developers.map((x) => x.id).includes(developerId))
      throw new BadRequestException("You are not part of this project");

    await this.prismaService.$transaction([
      ...project.channels.map((channel) => {
        return this.prismaService.projectChatChannel.update({
          where: {
            id: channel.id,
          },
          data: {
            participants: {
              set: channel.participants.filter((x) => x.id != developerId),
            },
          },
        });
      }),
      this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          developers: {
            set: project.developers.filter((x) => x.id != developerId),
          },
        },
      }),
    ]);

    return project.title;
  }

  async deleteProject(developerId: string, projectId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        title: true,
        developers: {
          select: {
            id: true,
          },
        },
        ownerId: true,
        channels: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!project) throw new BadRequestException("Could not find that project");

    if (project.ownerId != developerId)
      throw new BadRequestException("Cannot delete a project you don't own");

    await this.prismaService.project.delete({
      where: {
        id: projectId,
      },
    });

    return project.title;
  }

  async editProjectInfo(data: EditProjectDto, developerId: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!project)
      throw new BadRequestException("Could not find a project with that Id.");

    if (project.ownerId != developerId)
      throw new UnauthorizedException("Cannot edit a project you don't own");

    const updatedProject = await this.prismaService.project.update({
      where: {
        id: data.projectId,
      },
      data: {
        description: data.description,
        title: data.title,
        repoURL: data.repoURL,
      },
    });

    return updatedProject;
  }

  async removeDeveloperFromProject(
    developerId: string,
    data: RemoveDeveloperDto
  ) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        id: true,
        title: true,
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
        ownerId: true,
        channels: {
          select: {
            id: true,
            participants: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!project) throw new BadRequestException("Could not find that project");

    if (project.ownerId != developerId)
      throw new BadRequestException(
        "Cannot remove a developer from a project you don't own"
      );

    if (!project.developers.map((x) => x.id).includes(data.developerId))
      throw new BadRequestException("Developer is not part of this project");

    await this.prismaService.$transaction([
      ...project.channels.map((channel) => {
        return this.prismaService.projectChatChannel.update({
          where: {
            id: channel.id,
          },
          data: {
            participants: {
              set: channel.participants.filter((x) => x.id != data.developerId),
            },
          },
        });
      }),
      this.prismaService.project.update({
        where: {
          id: data.projectId,
        },
        data: {
          developers: {
            set: project.developers
              .filter((x) => x.id != data.developerId)
              .map((x) => ({
                id: x.id,
              })),
          },
        },
      }),
    ]);

    await this.notifService.createProjectNotification({
      developerId: data.developerId,
      referencedProjectId: project.id,
      message: "You have been removed from the project!",
    });

    return project.developers.filter((x) => x.id != data.developerId);
  }

  async likeProject(data: LikeProjectDto, developerId: string) {
    const existingLike = await this.prismaService.projectLike.findFirst({
      where: {
        developerId: developerId,
        projectId: data.projectId,
      },
    });

    if (existingLike)
      throw new BadRequestException("You have already liked this project");

    const project = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
    });

    if (!project) throw new BadRequestException("This project does not exist");

    const [_, newData] = await this.prismaService.$transaction([
      this.prismaService.projectLike.create({
        data: {
          project: {
            connect: {
              id: data.projectId,
            },
          },
          developer: {
            connect: {
              id: developerId,
            },
          },
        },
      }),
      this.prismaService.project.findFirstOrThrow({
        where: {
          id: data.projectId,
        },
        select: {
          id: true,
          likes: {
            select: {
              id: true,
              developerId: true,
            },
          },
        },
      }),
    ]);

    return newData;
  }

  async unlikeProject(data: LikeProjectDto, developerId) {
    try {
      const [_, newData] = await this.prismaService.$transaction([
        this.prismaService.projectLike.deleteMany({
          where: {
            projectId: data.projectId,
            developerId: developerId,
          },
        }),
        this.prismaService.project.findFirstOrThrow({
          where: {
            id: data.projectId,
          },
          select: {
            id: true,
            likes: {
              select: {
                id: true,
                developerId: true,
              },
            },
          },
        }),
      ]);

      return newData;
    } catch {
      throw new BadRequestException("Could not find that project");
    }
  }

  async addToChannel(data: AddToChannelDto, developerId: string) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        id: true,
        admins: {
          select: {
            id: true,
          },
        },
        participants: {
          select: {
            id: true,
          },
        },
        projectId: true,
      },
    });

    if (!channel) throw new BadRequestException("Could not find that channel");

    if (!channel.admins.map((x) => x.id).includes(developerId))
      throw new UnauthorizedException(
        "Only channel admins can add channel members"
      );

    if (channel.participants.map((x) => x.id).includes(data.developerId))
      throw new BadRequestException("That person is already in the channel");

    const updatedChannelParticpants =
      await this.prismaService.projectChatChannel.update({
        where: {
          id: data.channelId,
        },
        data: {
          participants: {
            set: [
              ...channel.participants.map((x) => ({ id: x.id })),
              { id: data.developerId },
            ],
          },
        },
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
      });

    await this.notifService.createProjectNotification({
      developerId: data.developerId,
      referencedProjectId: channel.projectId,
      message: "Someone has added you to a channel!",
    });

    return updatedChannelParticpants;
  }

  async removeFromChannel(data: AddToChannelDto, developerId: string) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        id: true,
        name: true,
        admins: {
          select: {
            id: true,
          },
        },
        participants: {
          select: {
            id: true,
          },
        },
        projectId: true,
      },
    });

    if (!channel) throw new BadRequestException("Could not find that channel");

    if (channel.name.toLowerCase() == "general")
      throw new BadRequestException(
        "Cannot remove developers from general chat"
      );

    if (!channel.admins.map((x) => x.id).includes(developerId))
      throw new UnauthorizedException(
        "Only channel admins can remove channel members"
      );

    if (!channel.participants.map((x) => x.id).includes(data.developerId))
      throw new BadRequestException("That person is not in the channel");

    const updatedChannelParticpants =
      await this.prismaService.projectChatChannel.update({
        where: {
          id: data.channelId,
        },
        data: {
          participants: {
            set: channel.participants
              .filter((x) => x.id != data.developerId)
              .map((x) => ({ id: x.id })),
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
        },
      });

    return updatedChannelParticpants;
  }

  async editChannel(data: EditChannelDto, developerId: string) {
    if (data.name.toLowerCase() == "general")
      throw new BadRequestException("Cannot name a channel 'General'");

    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        id: true,
        name: true,
        admins: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!channel) throw new BadRequestException("Could not find channel");

    if (!channel.admins.map((x) => x.id).includes(developerId))
      throw new UnauthorizedException(
        "Only channel admins can remove channel members"
      );

    if (channel.name.toLowerCase() == "general")
      throw new BadRequestException("Cannot change the general channel");

    const updatedChannelInfo =
      await this.prismaService.projectChatChannel.update({
        where: {
          id: data.channelId,
        },
        data: {
          name: data.name,
        },
        select: {
          id: true,
          name: true,
          participants: {
            select: {
              id: true,
            },
          },
        },
      });

    return updatedChannelInfo;
  }

  async deleteChannel(data: DeleteLeaveChannelDto, developerId: string) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        id: true,
        name: true,
        admins: {
          select: {
            id: true,
          },
        },
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!channel) throw new BadRequestException("Could not find channel");

    if (!channel.admins.map((x) => x.id).includes(developerId))
      throw new UnauthorizedException(
        "Only channel admins can delete a channel"
      );

    if (channel.name.toLowerCase() == "general")
      throw new BadRequestException("Cannot delete the general channel");

    await this.prismaService.projectChatChannel.delete({
      where: {
        id: data.channelId,
      },
    });

    return channel;
  }

  async leaveChannel(data: DeleteLeaveChannelDto, developerId: string) {
    const channel = await this.prismaService.projectChatChannel.findFirst({
      where: {
        id: data.channelId,
      },
      select: {
        id: true,
        name: true,
        admins: {
          select: {
            id: true,
          },
        },
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!channel) throw new BadRequestException("Could not find channel");

    if (!channel.participants.map((x) => x.id).includes(developerId))
      throw new BadRequestException("You are not in the channel");

    if (channel.name.toLowerCase() == "general")
      throw new BadRequestException("Cannot leave the general channel");

    const updatedChannel = await this.prismaService.projectChatChannel.update({
      where: {
        id: data.channelId,
      },
      data: {
        participants: {
          set: channel.participants
            .filter((x) => x.id != developerId)
            .map((x) => ({ id: x.id })),
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            name: true,
            id: true,
            githubUsername: true,
            avatarURL: true,
          },
        },
      },
    });

    return updatedChannel;
  }

  async createProjectSearchRequest(
    data: CreateProjectSearchRequestDto,
    developerId: string
  ) {
    const userProjectSearchRequests =
      await this.prismaService.projectSearchRequest.findMany({
        where: {
          developerId: developerId,
          resolved: false,
        },
        select: {
          id: true,
          developerId: true,
          tags: {
            select: {
              id: true,
            },
          },
        },
      });

    if (userProjectSearchRequests.length > 2)
      throw new BadRequestException(
        "You already have 2 pending project search requests"
      );

    if (
      userProjectSearchRequests.find((x) =>
        x.tags.every((y) => data.tagIds.includes(y.id))
      )
    ) {
      throw new BadRequestException(
        "You already have a pending project search for those allTechnologies"
      );
    }

    const res = await this.prismaService.projectSearchRequest.create({
      data: {
        developerId: developerId,
        tags: {
          connect: data.tagIds.map((x) => ({ id: x })),
        },
        allTagsRequired: data.allTechnologies,
      },
    });

    return "A project search request has been created for you.";
  }

  @Cron("0 10 * * * *")
  async answerProjectSearchRequests() {
    const openSearchRequests =
      await this.prismaService.projectSearchRequest.findMany({
        where: {
          resolved: false,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          allTagsRequired: true,
          developerId: true,
          tags: {
            select: {
              id: true,
            },
          },
        },
      });

    const projects = await this.prismaService.project.findMany({
      select: {
        id: true,
        ownerId: true,
        developers: {
          select: {
            id: true,
          },
        },
        tags: {
          select: {
            id: true,
          },
        },
      },
    });

    const mappings: {
      requestId: string;
      projectid: string;
      developerId: string;
    }[] = [];
    const felxableRequests = openSearchRequests.filter(
      (x) => x.allTagsRequired
    );
    const inflexableRequests = openSearchRequests.filter(
      (x) => !x.allTagsRequired
    );

    felxableRequests.forEach((request) => {
      const requestTags = request.tags.map((z) => z.id);
      const matchingProject = projects.find((x) =>
        x.tags.some((y) => requestTags.includes(y.id))
      );

      if (matchingProject) {
        if (
          matchingProject.ownerId == request.developerId ||
          matchingProject.developers
            .map((x) => x.id)
            .includes(request.developerId)
        ) {
          return;
        } else {
          mappings.push({
            requestId: request.id,
            projectid: matchingProject.id,
            developerId: request.developerId,
          });
        }
      }
    });

    inflexableRequests.forEach((request) => {
      const requestTags = request.tags.map((z) => z.id);
      const matchingProject = projects.find((x) =>
        x.tags.every((y) => requestTags.includes(y.id))
      );

      if (matchingProject) {
        if (
          matchingProject.ownerId == request.developerId ||
          matchingProject.developers
            .map((x) => x.id)
            .includes(request.developerId)
        ) {
          return;
        } else {
          mappings.push({
            requestId: request.id,
            projectid: matchingProject.id,
            developerId: request.developerId,
          });
        }
      }
    });

    const res = await this.prismaService.$transaction([
      ...mappings.map((x) =>
        this.prismaService.projectSearchRequestAnswer.create({
          data: {
            requestId: x.requestId,
            projectId: x.projectid,
            developerId: x.developerId,
          },
        })
      ),
      ...mappings.map((x) =>
        this.prismaService.projectSearchRequest.update({
          where: {
            id: x.requestId,
          },
          data: {
            resolved: true,
            resolvedAt: new Date(),
          },
        })
      ),
    ]);
  }
}
