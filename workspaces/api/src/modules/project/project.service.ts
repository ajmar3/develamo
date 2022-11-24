import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async getAllTags() {
    return await this.prismaService.tag.findMany();
  }
}
