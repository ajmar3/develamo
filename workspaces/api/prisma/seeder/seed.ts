import { PrismaClient } from "@prisma/client";
import { seedDevelopers } from "./seed.developers";

const prisma = new PrismaClient();

async function seed() {
  await seedDevelopers(prisma);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("seeder failed with error: ", e);
    await prisma.$disconnect();
  });
