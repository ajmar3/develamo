import { IsString } from "class-validator";

export class ConnectWebsocketDto {
  @IsString()
  developerId: string;
}

export class ConnectProjectWebsocketDto {
  @IsString()
  developerId: string;

  @IsString()
  projectId: string;
}
