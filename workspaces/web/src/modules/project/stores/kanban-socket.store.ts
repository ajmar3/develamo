import { io, Socket } from "socket.io-client";
import create from "zustand";
import { EditTicketListType, TicketListType, TicketType } from "../types/kanban.types";
import { useKanbanStore } from "./kanban-store";
import { stringify } from "querystring";
import { useFeedbackStore } from "modules/common/stores/feedback.store";

export interface IProjectSocketStore {
  socket: Socket;
  initSocket: (data: { developerId: string; projectId: string }) => void;
  createTicketList: (data: { projectId: string; title: string }) => void;
  createTicket: (data: {
    projectId: string;
    title: string;
    ticketListId: string;
  }) => void;
  reorderTicket: (data: {
    projectId: string;
    id: string;
    newTicketListId: string;
    oldTicketListId: string;
    newOrderIndex: number;
    oldOrderIndex: number;
  }) => void;
  reorderTicketList: (data: {
    projectId: string;
    id: string;
    newOrderIndex: number;
    oldOrderIndex: number;
  }) => void;
  editTicketList: (data: { ticketListId: string; newTitle: string }) => void;
  editTicket: (data: { ticketId: string, newTitle: string, newDescription: string }) => void;
  deleteTicket: (data: { ticketId: string, ticketListId: string }) => void;
  deleteTicketList: (data: { ticketListId: string, projectId: string }) => void;
}

export const useKanbanSocketStore = create<IProjectSocketStore>((set) => {
  const kanbanStore = useKanbanStore.getState();
  const feedbackStore = useFeedbackStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_KANBAN_WEBSOCKET_URL as string, {
    withCredentials: true,
  });

  socket.on("ticket-list-info", (data: TicketListType[]) => {
    const tempString = JSON.stringify(data);
    const temp = JSON.parse(tempString);
    kanbanStore.setTicketLists(temp);
    kanbanStore.setLocalUpdatedTicketLists(data);
  });

  socket.on("update-ticket-list", (data: TicketListType) => {
    kanbanStore.updateTicketList(data);
  });

  socket.on("connected", () => {
    kanbanStore.setConnected(true);
  });

  socket.on("ticket-list-edit", (newListData: EditTicketListType) => {
    kanbanStore.editTicketList(newListData);
  });

  socket.on("ticket-edit", (newData: TicketType) => {
    kanbanStore.editTicket(newData);
  });

  socket.on("error", (error) => {
    feedbackStore.addMessage(error);
  });

  return {
    socket: socket,
    initSocket: (data: { projectId: string }) => {
      socket.emit("connected", data);
    },
    createTicketList: (data: { projectId: string; title: string }) => {
      socket.emit("create-ticket-list", data);
    },
    createTicket: (data: {
      projectId: string;
      title: string;
      ticketListId: string;
    }) => {
      socket.emit("create-ticket", data);
    },
    reorderTicket: (data: {
      projectId: string;
      id: string;
      newTicketListId: string;
      oldTicketListId: string;
      newOrderIndex: number;
      oldOrderIndex: number;
    }) => {
      socket.emit("reorder-ticket", data);
    },
    reorderTicketList: (data: {
      projectId: string;
      id: string;
      newOrderIndex: number;
      oldOrderIndex: number;
    }) => {
      socket.emit("reorder-ticket-list", data);
    },
    editTicketList: (data: { ticketListId: string; newTitle: string }) => {
      socket.emit("edit-ticket-list", data);
    },
    editTicket: (data: { ticketId: string, newTitle: string, newDescription: string }) => {
      socket.emit("edit-ticket", data);
    },
    deleteTicket: (data: { ticketId: string, ticketListId: string }) => {
      socket.emit("delete-ticket", data);
    },
    deleteTicketList: (data: { ticketListId: string, projectId: string }) => {
      socket.emit("delete-ticket-list", data);
    },
  };
});
