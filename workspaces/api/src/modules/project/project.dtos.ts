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

export class CreateChannelDto {
  @IsString()
  projectId: string;

  @IsString()
  name: string;
}

export class CreateChannelMessageDto {
  @IsString()
  channelId: string;

  @IsString()
  text: string;
}

export class EditProjectDto {
  @IsString()
  projectId: string;

  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  @ValidateIf((object, value) => value != null || value != undefined)
  repoURL: string;
}

export class RemoveDeveloperDto {
  @IsString()
  projectId: string;

  @IsString()
  developerId: string;
}

export class LikeProjectDto {
  @IsString()
  projectId: string;
}

export class AddToChannelDto {
  @IsString()
  channelId: string;

  @IsString()
  developerId: string;
}

export class EditChannelDto {
  @IsString()
  channelId: string;

  @IsString()
  name: string;
}

export class DeleteLeaveChannelDto {
  @IsString()
  channelId: string;
}
