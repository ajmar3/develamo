import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./seed.admin";
import { seedConnectionLists } from "./seed.connectionLists";
import { seedDevelopers } from "./seed.developers";
import { SEEDHISTORYREGISTER } from "./seed.historyRegister";
import { isInSeedHistory } from "./seed.isInSeedHistory";
import { seedTags } from "./seed.tags";

const prisma = new PrismaClient();

async function seedDev() {
  if (!(await isInSeedHistory(prisma, SEEDHISTORYREGISTER.SEED_DEVELOPERS)))
    await seedDevelopers(prisma);
  if (!(await isInSeedHistory(prisma, SEEDHISTORYREGISTER.SEED_ADMIN)))
    await seedAdmin(prisma);
  if (!(await isInSeedHistory(prisma, SEEDHISTORYREGISTER.SEED_TAGS)))
    await seedTags(prisma);
  if (
    !(await isInSeedHistory(prisma, SEEDHISTORYREGISTER.SEED_CONNECTION_LISTS))
  )
    await seedConnectionLists(prisma);
}

seedDev()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("seeder failed with error: ", e);
    await prisma.$disconnect();
  });
