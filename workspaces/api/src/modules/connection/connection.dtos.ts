import { IsString } from "class-validator";

export class CreateConnectionRequestDto {
  @IsString()
  requestedId: string;
}

export class RespondConnectionRequestDto {
  @IsString()
  requestId: string;
}
