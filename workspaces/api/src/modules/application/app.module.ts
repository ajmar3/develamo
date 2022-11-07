import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DeveloperController } from "./app.controller";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [DeveloperController],
  providers: [PrismaService],
})
export class AppModule {}
