import {
  IsArray,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

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

  @IsString()
  @ValidateIf((object, value) => value != null || value != undefined)
  repoURL: string;
}
