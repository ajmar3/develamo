import { IsNumber, IsString } from "class-validator";

export class CreateChatNotificationDto {
  referencedChatId: string;
  developerId: string;
  message: string;
}

export class CreateDeveloperNotificationDto {
  referencedDeveloperId: string;
  developerId: string;
  message: string;
}

export class CreateProjectNotificationDto {
  referencedProjectId: string;
  developerId: string;
  message: string;
}

export class GetNotificationDto {
  @IsString()
  developerId: string;
}

export class MarkNotificationAsReadDto {
  @IsString()
  notificationId: string;
}
