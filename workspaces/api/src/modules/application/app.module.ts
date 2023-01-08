import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ConnectionModule } from "../connection/connection.module";
import { DatabaseModule } from "../database/database.module";
import { DeveloperModule } from "../developer/developer.module";
import { ProjectModule } from "../project/project.module";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    DeveloperModule,
    ProjectModule,
    ConnectionModule,
    SearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
