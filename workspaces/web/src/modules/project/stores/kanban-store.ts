import create from "zustand";
import {
  ProjectChatChannelType,
  ProjectChatMessageType,
  ProjectInfoType,
} from "../types/chat-types";
import {
  EditTicketListType,
  TicketListType,
  TicketType,
} from "../types/kanban.types";

export interface IKanbanStore {
  connected: boolean;
  setConnected: (newState: boolean) => void;
  ticketLists: TicketListType[];
  setTicketLists: (newListInfo: TicketListType[]) => void;
  updateTicketList: (updatedList: TicketListType) => void;
  editTicketList: (newListData: EditTicketListType) => void;
  activeId: string | null | number;
  setActiveId: (newId: string | null | number) => void;
  localUpdatedTicketLists: TicketListType[];
  setLocalUpdatedTicketLists: (newListInfo: TicketListType[]) => void;
  openTicketInfo: TicketType | undefined;
  setOpenTicketInfo: (info: TicketType | undefined) => void;
  editTicket: (data: TicketType) => void;
}

export const useKanbanStore = create<IKanbanStore>((set) => {
  return {
    connected: false,
    setConnected: (newState: boolean) =>
      set((state) => ({ connected: newState })),
    ticketLists: [],
    setTicketLists: (newListInfo: TicketListType[]) =>
      set((state) => ({ ticketLists: newListInfo })),
    updateTicketList: (updatedList: TicketListType) =>
      set((state) => {
        const current = state.ticketLists.filter((x) => x.id != updatedList.id);
        current.push(updatedList);
        current.sort(
          (a: TicketListType, b: TicketListType) => a.orderIndex - b.orderIndex
        );
        const currentLocal = state.localUpdatedTicketLists.filter(
          (x) => x.id != updatedList.id
        );
        currentLocal.push(updatedList);
        currentLocal.sort(
          (a: TicketListType, b: TicketListType) => a.orderIndex - b.orderIndex
        );
        return { ticketLists: current, localUpdatedTicketLists: currentLocal };
      }),
    editTicketList: (newListData: EditTicketListType) =>
      set((state) => {
        const current = [...state.ticketLists];
        const currentIndex = state.ticketLists.findIndex(
          (x) => x.id == newListData.id
        );
        if (currentIndex > -1) {
          state.ticketLists[currentIndex].title = newListData.title;
          state.ticketLists[currentIndex].tickets = newListData.tickets;
        }
        const currentLocal = [...state.localUpdatedTicketLists];
        const currentLocalIndex = state.localUpdatedTicketLists.findIndex(
          (x) => x.id == newListData.id
        );
        if (currentLocalIndex > -1) {
          state.localUpdatedTicketLists[currentLocalIndex].title =
            newListData.title;
          state.localUpdatedTicketLists[currentLocalIndex].tickets =
            newListData.tickets;
        }
        return { ticketLists: current, localUpdatedTicketLists: currentLocal };
      }),
    activeId: null,
    setActiveId: (newId: string | null | number) =>
      set((state) => ({ activeId: newId })),
    localUpdatedTicketLists: [],
    setLocalUpdatedTicketLists: (newListInfo: TicketListType[]) =>
      set((state) => ({ localUpdatedTicketLists: newListInfo })),
    openTicketInfo: undefined,
    setOpenTicketInfo: (info: TicketType | undefined) =>
      set((state) => ({ openTicketInfo: info })),
    editTicket: (data: TicketType) =>
      set((state) => {
        const currentLists = [...state.ticketLists];
        const currentListIndex = state.ticketLists.findIndex(
          (x) => x.tickets.map(y => y.id).includes(data.id)
        );
        if (currentListIndex > -1) {
          const currentTicketIndex = state.ticketLists[currentListIndex].tickets.findIndex(x => x.id == data.id);
          if (currentTicketIndex > -1) {
            state.ticketLists[currentListIndex].tickets[currentTicketIndex] = data;
          }
        }
        const currentLocalLists = [...state.localUpdatedTicketLists];
        const currentLocalListIndex = state.localUpdatedTicketLists.findIndex(
          (x) => x.tickets.map(y => y.id).includes(data.id)
        );
        if (currentLocalListIndex > -1) {
          const currentLocalTicketIndex = state.localUpdatedTicketLists[currentLocalListIndex].tickets.findIndex(x => x.id == data.id);
          if (currentLocalTicketIndex > -1) {
            state.localUpdatedTicketLists[currentLocalListIndex].tickets[currentLocalTicketIndex] = data;
          }
        }
        return { ticketLists: currentLists, localUpdatedTicketLists: currentLocalLists };
      }),
  };
});
