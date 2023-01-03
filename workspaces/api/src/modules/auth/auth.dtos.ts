import { IsString } from "class-validator";

export class AdminTokenGenerateDto {
  @IsString()
  userEmail: string;
}
