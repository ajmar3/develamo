import { IsString } from "class-validator";

export class SearchDeveloperDto {
  @IsString()
  input: string;
}
