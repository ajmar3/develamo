import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { SEEDHISTORYREGISTER } from "./seed.historyRegister";

export async function seedAdmin(prisma: PrismaClient) {
  await prisma.developer.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      githubUsername: faker.internet.userName(),
      githubId: faker.datatype.uuid(),
      bio: faker.lorem.words(15),
      name: "develamo admin",
      avatarURL: "https://placeimg.com/192/192/people",
    },
  });

  await prisma.seedHistory.create({
    data: {
      id: SEEDHISTORYREGISTER.SEED_ADMIN,
    },
  });
}
