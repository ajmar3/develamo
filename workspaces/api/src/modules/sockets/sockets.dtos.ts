import { IsString } from "class-validator";

export class ConnectWebsocketDto {
  @IsString()
  developerId: string;
}
