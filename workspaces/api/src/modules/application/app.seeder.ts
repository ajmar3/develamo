import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private prismaService: PrismaService) {}

  private readonly logger = new Logger(SeederService.name);

  private readonly seedHistoryRegister = {
    SEED_TAGS: "seed-tags",
  };

  async onApplicationBootstrap() {
    await this.seedData();
  }

  private async isInSeedHistory(seedId: string) {
    const exists = await this.prismaService.seedHistory.findFirst({
      where: {
        id: seedId,
      },
    });

    if (exists) return true;
    else return false;
  }

  private async seedData() {
    this.logger.log("SEEDER STARTING");

    if (!(await this.isInSeedHistory(this.seedHistoryRegister.SEED_TAGS))) {
      await this.prismaService.tag.createMany({
        data: [
          { title: "Django" },
          { title: "Python" },
          { title: "Typescript" },
          { title: "React.Js" },
          { title: "Vue.Js" },
          { title: "Flask" },
          { title: "Express.Js" },
          { title: "Nest.Js" },
        ],
      });

      await this.prismaService.seedHistory.create({
        data: {
          id: this.seedHistoryRegister.SEED_TAGS,
        },
      });

      this.logger.log("SEEDED: " + this.seedHistoryRegister.SEED_TAGS);
    }

    this.logger.log("SEEDER FINISHED");
    return;
  }
}
