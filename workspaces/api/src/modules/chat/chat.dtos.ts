import { IsArray, IsString } from "class-validator";

export class NewMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  text: string;
}

export class OpenChatDto {
  @IsString()
  chatId: string;
}

export class OpenChatFromDeveloperDto {
  @IsString()
  developerId: string;
}

export class CreateDirectMessageChatDto {
  @IsArray()
  developerIds: string[];
}

export class ViewMessageDto {
  @IsString()
  chatId: string;
}
