import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/modules/database/prisma.service";
import {
  CreateTicketDto,
  CreateTicketListDto,
  EditTicketListDto,
  ReorderTicketDto,
  ReorderTicketListDto,
} from "./kanban.dto";

@Injectable()
export class KanbanService {
  constructor(private prismaService: PrismaService) {}

  async getProjectTicketLists(projectId: string, developerId: string) {
    const projectInfo = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        developers: {
          select: {
            id: true,
          },
        },
        ownerId: true,
        ticketLists: {
          select: {
            id: true,
            orderIndex: true,
            title: true,
            tickets: {
              select: {
                id: true,
                orderIndex: true,
                ticketListId: true,
                assignedDevelopers: {
                  select: {
                    id: true,
                    githubUsername: true,
                    name: true,
                    avatarURL: true,
                  },
                },
                title: true,
                description: true,
                createdAt: true,
                editedAt: true,
              },
              orderBy: {
                orderIndex: "asc",
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    if (!projectInfo)
      throw new BadRequestException("Could not find that project");

    if (
      !projectInfo.developers.some((x) => x.id == developerId) &&
      projectInfo.ownerId != developerId
    )
      throw new UnauthorizedException("You are not part of that project");

    return projectInfo.ticketLists;
  }

  async createTicketList(data: CreateTicketListDto, developerId: string) {
    const projectInfo = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        ticketLists: {
          select: {
            orderIndex: true,
          },
          orderBy: {
            orderIndex: "desc",
          },
        },
        developers: {
          select: {
            id: true,
          },
        },
        ownerId: true,
      },
    });

    if (!projectInfo)
      throw new BadRequestException("Could not find that project");

    if (
      !projectInfo.developers.some((x) => x.id == developerId) &&
      projectInfo.ownerId != developerId
    )
      throw new UnauthorizedException("You are not part of that project");

    const highestIndex =
      projectInfo.ticketLists.length > 0
        ? projectInfo.ticketLists[0].orderIndex
        : 0;

    await this.prismaService.ticketList.create({
      data: {
        orderIndex: highestIndex + 1,
        title: data.title,
        projectId: data.projectId,
      },
    });

    const newTicketListInfo = await this.prismaService.ticketList.findMany({
      where: {
        projectId: data.projectId,
      },
      select: {
        id: true,
        orderIndex: true,
        title: true,
        tickets: {
          select: {
            id: true,
            orderIndex: true,
            ticketListId: true,
            assignedDevelopers: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
            title: true,
            description: true,
            createdAt: true,
            editedAt: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return newTicketListInfo;
  }

  async createTicket(data: CreateTicketDto, developerId: string) {
    const projectInfo = await this.prismaService.project.findFirst({
      where: {
        id: data.projectId,
      },
      select: {
        ticketLists: {
          select: {
            orderIndex: true,
            id: true,
            tickets: {
              select: {
                orderIndex: true,
              },
              orderBy: {
                orderIndex: "asc",
              },
              take: 1,
            },
          },
          orderBy: {
            orderIndex: "desc",
          },
        },
        developers: {
          select: {
            id: true,
          },
        },
        ownerId: true,
      },
    });

    if (!projectInfo)
      throw new BadRequestException("Could not find that project");

    if (
      !projectInfo.developers.some((x) => x.id == developerId) &&
      projectInfo.ownerId != developerId
    )
      throw new UnauthorizedException("You are not part of that project");

    const relativeList = projectInfo.ticketLists.find(
      (x) => x.id == data.ticketListId
    );

    if (!relativeList)
      throw new BadRequestException("Could not find that ticket list");

    const highestIndex =
      relativeList.tickets.length > 0 ? relativeList.tickets[0].orderIndex : 0;

    await this.prismaService.ticket.create({
      data: {
        projectId: data.projectId,
        ticketListId: data.ticketListId,
        title: data.title,
        description: "",
        orderIndex: highestIndex + 1,
      },
    });

    const updatedList = await this.prismaService.ticketList.findFirst({
      where: {
        id: data.ticketListId,
      },
      select: {
        id: true,
        orderIndex: true,
        title: true,
        tickets: {
          select: {
            id: true,
            orderIndex: true,
            ticketListId: true,
            assignedDevelopers: {
              select: {
                id: true,
                githubUsername: true,
                name: true,
                avatarURL: true,
              },
            },
            title: true,
            description: true,
            createdAt: true,
            editedAt: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    return updatedList;
  }

  async reorderTicket(data: ReorderTicketDto, developerId: string) {
    const ticket = await this.prismaService.ticket.findFirst({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        orderIndex: true,
        ticketListId: true,
        project: {
          select: {
            id: true,
            developers: {
              select: {
                id: true,
              },
            },
            ownerId: true,
          },
        },
      },
    });

    if (!ticket || ticket.project.id != data.projectId)
      throw new BadRequestException("Could not find that ticket");

    if (
      !ticket.project.developers.map((x) => x.id).includes(developerId) &&
      ticket.project.ownerId != developerId
    )
      throw new UnauthorizedException(
        "You do not have permission to alter that ticket"
      );

    const ticketsToBeUpdated = [];

    if (data.oldTicketListId == data.newTicketListId) {
      // if ticket is being moved within a loop

      const affectedTickets = await this.prismaService.ticket.findMany({
        where: {
          ticketListId: data.newTicketListId,
        },
        select: {
          orderIndex: true,
          id: true,
          ticketListId: true,
        },
      });

      if (data.newOrderIndex < data.oldOrderIndex) {
        // if ticket is being moved up the loop (to a lower index, up the page)
        const ticketsToIncrement = affectedTickets.filter(
          (x) =>
            x.orderIndex < data.oldOrderIndex &&
            x.orderIndex >= data.newOrderIndex
        );
        ticketsToIncrement.forEach((x) => {
          ticketsToBeUpdated.push({
            id: x.id,
            orderIndex: x.orderIndex + 1,
            ticketListId: x.ticketListId,
          });
        });
      } else {
        // if ticket is being moved down the loop (to a higher index, down the page)
        const ticketsToDecrement = affectedTickets.filter(
          (x) =>
            x.orderIndex <= data.newOrderIndex &&
            x.orderIndex > data.oldOrderIndex
        );
        ticketsToDecrement.forEach((x) => {
          ticketsToBeUpdated.push({
            id: x.id,
            orderIndex: x.orderIndex - 1,
            ticketListId: x.ticketListId,
          });
        });
      }

      // add ticket in question
      ticketsToBeUpdated.push({
        id: data.id,
        orderIndex: data.newOrderIndex,
        ticketListId: data.newTicketListId,
      });
    } else {
      // if the ticket is being moved across ticket lists
      const affectedTickets = await this.prismaService.ticket.findMany({
        where: {
          ticketListId: {
            in: [data.oldTicketListId, data.newTicketListId],
          },
        },
        select: {
          orderIndex: true,
          id: true,
          ticketListId: true,
        },
      });

      affectedTickets.forEach((ticket) => {
        if (
          ticket.ticketListId == data.oldTicketListId &&
          ticket.orderIndex > data.oldOrderIndex
        ) {
          ticketsToBeUpdated.push({
            id: ticket.id,
            orderIndex: ticket.orderIndex - 1,
            ticketListId: ticket.ticketListId,
          });
        } else if (
          ticket.ticketListId == data.newTicketListId &&
          ticket.orderIndex >= data.newOrderIndex
        ) {
          ticketsToBeUpdated.push({
            id: ticket.id,
            orderIndex: ticket.orderIndex + 1,
            ticketListId: ticket.ticketListId,
          });
        }
      });

      //add ticket in question
      ticketsToBeUpdated.push({
        id: data.id,
        orderIndex: data.newOrderIndex,
        ticketListId: data.newTicketListId,
      });
    }

    // pass transaction into prisma
    await this.prismaService.$transaction(
      ticketsToBeUpdated.map((x) => {
        return this.prismaService.ticket.update({
          where: {
            id: x.id,
          },
          data: {
            orderIndex: x.orderIndex,
            ticketListId: x.ticketListId,
          },
        });
      })
    );

    const newData = await this.getProjectTicketLists(
      data.projectId,
      developerId
    );

    return newData;
  }

  async reorderTicketList(data: ReorderTicketListDto, developerId: string) {
    const ticketList = await this.prismaService.ticketList.findFirst({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        orderIndex: true,
        project: {
          select: {
            id: true,
            developers: {
              select: {
                id: true,
              },
            },
            ownerId: true,
          },
        },
      },
    });

    if (!ticketList || ticketList.project.id != data.projectId)
      throw new BadRequestException("Could not find that ticket list");

    if (
      !ticketList.project.developers.map((x) => x.id).includes(developerId) &&
      ticketList.project.ownerId != developerId
    )
      throw new UnauthorizedException(
        "You do not have permission to alter that ticket list"
      );

    const ticketListsToBeUpdated = [];

    const affectedTicketLists = await this.prismaService.ticketList.findMany({
      where: {
        projectId: data.projectId,
      },
      select: {
        id: true,
        orderIndex: true,
      },
    });

    if (data.newOrderIndex < data.oldOrderIndex) {
      // if ticket list is moving left (to a lower index)
      const ticketListsToIncrement = affectedTicketLists.filter(
        (x) =>
          x.orderIndex < data.oldOrderIndex &&
          x.orderIndex >= data.newOrderIndex
      );
      ticketListsToIncrement.forEach((x) => {
        ticketListsToBeUpdated.push({
          id: x.id,
          orderIndex: x.orderIndex + 1,
        });
      });
    } else {
      // if ticket list is moving right (to a higher index)
      const ticketListsToDecrement = affectedTicketLists.filter(
        (x) =>
          x.orderIndex <= data.newOrderIndex &&
          x.orderIndex > data.oldOrderIndex
      );
      ticketListsToDecrement.forEach((x) => {
        ticketListsToBeUpdated.push({
          id: x.id,
          orderIndex: x.orderIndex - 1,
        });
      });
    }

    //add ticket list in question
    ticketListsToBeUpdated.push({
      id: data.id,
      orderIndex: data.newOrderIndex,
    });

    // pass transaction into prisma
    await this.prismaService.$transaction(
      ticketListsToBeUpdated.map((x) => {
        return this.prismaService.ticketList.update({
          where: {
            id: x.id,
          },
          data: {
            orderIndex: x.orderIndex,
          },
        });
      })
    );

    const newData = await this.getProjectTicketLists(
      data.projectId,
      developerId
    );

    return newData;
  }

  async editTicketList(data: EditTicketListDto, developerId: string) {
    const ticketList = await this.prismaService.ticketList.findFirst({
      where: {
        id: data.ticketListId,
      },
      select: {
        id: true,
        title: true,
        projectId: true,
        project: {
          select: {
            developers: {
              select: {
                id: true,
              },
            },
            ownerId: true,
          },
        },
      },
    });

    if (!ticketList)
      throw new BadRequestException("Could not find that ticket list");

    if (
      !ticketList.project.developers.map((x) => x.id).includes(developerId) &&
      developerId != ticketList.project.ownerId
    ) {
      throw new UnauthorizedException(
        "You do not have permission to modify that ticket list"
      );
    }

    if (ticketList.title == data.newTitle) return ticketList;

    const updatedTicketList = await this.prismaService.ticketList.update({
      where: {
        id: data.ticketListId,
      },
      data: {
        title: data.newTitle,
      },
      select: {
        id: true,
        title: true,
        projectId: true,
      },
    });

    return updatedTicketList;
  }
}
