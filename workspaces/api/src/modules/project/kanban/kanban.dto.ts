import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class CreateTicketListDto {
  @IsString()
  title: string;

  @IsString()
  projectId: string;
}

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  projectId: string;

  @IsString()
  ticketListId: string;
}

export class ConnectKanbanWebsocketDto {
  @IsString()
  projectId: string;
}

export class ReorderTicketListDto {
  @IsString()
  projectId: string;

  @IsString()
  id: string;

  @IsNumber()
  oldOrderIndex: number;

  @IsNumber()
  newOrderIndex: number;
}

export class ReorderTicketDto {
  @IsString()
  projectId: string;

  @IsString()
  id: string;

  @IsNumber()
  oldOrderIndex: number;

  @IsNumber()
  newOrderIndex: number;

  @IsString()
  oldTicketListId: string;

  @IsString()
  newTicketListId: string;
}

export class EditTicketListDto {
  @IsString()
  ticketListId: string;

  @IsString()
  newTitle: string;
}

export class EditTicketDto {
  @IsString()
  ticketId: string;

  @IsString()
  @Length(5)
  newTitle: string;

  @IsString()
  newDescription: string;
}

export class DeleteTicketDto {
  @IsString()
  ticketId: string;

  @IsString()
  ticketListId: string;
}

export class DeleteTicketListDto {
  @IsString()
  ticketListId: string;

  @IsString()
  projectId: string;
}
