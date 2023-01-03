import { PrismaClient } from "@prisma/client";
import { SEEDHISTORYREGISTER } from "./seed.historyRegister";

export async function seedConnectionLists(prisma: PrismaClient) {
  const developers = await prisma.developer.findMany();

  for (let i = 0; i < developers.length; i++) {
    const current = developers[i];
    await prisma.connectionList.upsert({
      where: {
        developerId: current.id,
      },
      update: {},
      create: {
        developerId: current.id,
      },
    });
  }

  await prisma.seedHistory.create({
    data: {
      id: SEEDHISTORYREGISTER.SEED_CONNECTION_LISTS,
    },
  });
}
