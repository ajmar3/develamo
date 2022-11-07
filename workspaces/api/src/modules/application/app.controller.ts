import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("dev")
export class DeveloperController {
  constructor(private prismaService: PrismaService) {}

  @Get("")
  async getDeveloperKnownTechnologyIds() {
    return { hello: "world" };
  }
}
