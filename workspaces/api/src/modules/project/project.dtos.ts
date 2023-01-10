import { IsArray, IsNumber, IsString, MinLength } from "class-validator";

export class ProjectFeedDto {
  @IsNumber()
  offset: number;
}

export class CreateProjectDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsArray()
  tagIds: string[];
}
