import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedDevelopers(prisma: PrismaClient) {
  const developers = [];
  for (let i = 0; i < 20; i++) {
    developers[i] = {
      email: faker.internet.email(),
      githubUsername: faker.internet.userName(),
      githubId: faker.datatype.uuid(),
      bio: faker.lorem.words(15),
      name: faker.name.fullName(),
      avatarURL: "https://placeimg.com/192/192/people",
    };
  }

  await prisma.developer.createMany({
    data: developers,
  });
}
