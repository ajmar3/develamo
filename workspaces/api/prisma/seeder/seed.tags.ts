import { PrismaClient } from "@prisma/client";
import { SEEDHISTORYREGISTER } from "./seed.historyRegister";

export async function seedTags(prisma: PrismaClient) {
  await prisma.tag.createMany({
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

  await prisma.seedHistory.create({
    data: {
      id: SEEDHISTORYREGISTER.SEED_TAGS,
    },
  });
}
