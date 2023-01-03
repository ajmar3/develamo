import { PrismaClient } from "@prisma/client";

export async function isInSeedHistory(prisma: PrismaClient, seedId: string) {
  const record = await prisma.seedHistory.findFirst({
    where: {
      id: seedId,
    },
  });

  if (record) return true;
  else return false;
}
