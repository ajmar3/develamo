import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConnectionModule } from "../connection/connection.module";
import { ActionsGateway } from "./actions.gateway";

@Module({
  imports: [ConnectionModule, JwtModule],
  providers: [ActionsGateway],
})
export class SocketsModule {}
