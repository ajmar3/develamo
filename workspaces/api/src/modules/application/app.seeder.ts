import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor() {
    return;
  }

  private readonly logger = new Logger(SeederService.name);

  private readonly seedHistoryRegister = {
    SEED_USERS: "SeedUsers",
  };

  async onApplicationBootstrap() {
    await this.seedData();
  }

  private async seedData() {
    return;
  }
}
