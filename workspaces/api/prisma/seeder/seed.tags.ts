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
      { title: "Angular.Js" },
      { title: "FastAPI" },
      { title: "MySQL" },
      { title: "PostgreSQL" },
      { title: "MongoDB" },
      { title: "Redis" },
      { title: ".NET Core" },
      { title: "C#" },
      { title: "Java" },
      { title: "Spring" },
    ],
  });

  await prisma.seedHistory.create({
    data: {
      id: SEEDHISTORYREGISTER.SEED_TAGS,
    },
  });
}
