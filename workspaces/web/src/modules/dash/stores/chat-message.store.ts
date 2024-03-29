import { faTags } from "@fortawesome/free-solid-svg-icons";
import {
  ChatInfoType,
  ChatListDMType,
  ChatListProjectType,
  DirectMessageType,
} from "modules/common/types/chat.types";
import create from "zustand";

export interface IDirectMessageStore {
  chats: {
    directMessageChats: ChatListDMType[];
    projectChats: ChatListProjectType[];
  };
  setChats: (chats: {
    directMessageChats: ChatListDMType[];
    projectChats: ChatListProjectType[];
  }) => void;
  addDirectMessageChat: (data: ChatListDMType) => void;
  updateChatMessages: (data: {
    chatId: string;
    newMessages: DirectMessageType[];
  }) => void;
  openChatId: string;
  setOpenChatId: (newChatId?: string) => void;
  chatOpening: boolean;
  setChatOpening: (newState: boolean) => void;
  openChatInfo?: ChatInfoType;
  setOpenChatInfo: (newInfo?: ChatInfoType) => void;
  openChatMessages: DirectMessageType[];
  setOpenChatMessages: (newMessages?: DirectMessageType[]) => void;
}

export const useChatMessageStore = create<IDirectMessageStore>((set) => ({
  chats: {
    directMessageChats: [],
    projectChats: [],
  },
  setChats: (chats: {
    directMessageChats: ChatListDMType[];
    projectChats: ChatListProjectType[];
  }) =>
    set((state) => {
      const newDirectMessageChats = chats.directMessageChats;
      newDirectMessageChats.sort((a, b) => {
        if (a.messages.length < 1) return 1;
        else if (b.messages.length < 1) return -1;
        else
          return (
            new Date(b.messages[0].sentAt).valueOf() -
            new Date(a.messages[0].sentAt).valueOf()
          );
      });
      return {
        chats: {
          projectChats: chats.projectChats,
          directMessageChats: newDirectMessageChats,
        },
      };
    }),
  addDirectMessageChat: (data: ChatListDMType) =>
    set((state) => {
      return {
        chats: {
          projectChats: state.chats.projectChats,
          directMessageChats: [...state.chats.directMessageChats, data],
        },
      };
    }),
  updateChatMessages: (data: {
    chatId: string;
    newMessages: DirectMessageType[];
  }) =>
    set((state) => {
      const chat = state.chats.directMessageChats.find(
        (x) => x.id == data.chatId
      );
      if (!chat) return { chats: state.chats };
      chat.messages = data.newMessages;
      const newChats = [
        ...state.chats.directMessageChats.filter((x) => x.id != chat.id),
        chat,
      ];
      newChats.sort((a, b) => {
        if (a.messages.length < 1) return 1;
        else if (b.messages.length < 1) return -1;
        else
          return (
            new Date(b.messages[0].sentAt).valueOf() -
            new Date(a.messages[0].sentAt).valueOf()
          );
      });
      return {
        chats: {
          projectChats: state.chats.projectChats,
          directMessageChats: newChats,
        },
      };
    }),
  openChatId: "",
  chatOpening: false,
  setChatOpening: (newState: boolean) =>
    set((state) => ({ chatOpening: newState })),
  setOpenChatId: (newChatId?: string) =>
    set((state) => ({ openChatId: newChatId })),
  setOpenChatInfo: (newInfo?: any) =>
    set((state) => ({ openChatInfo: newInfo })),
  openChatMessages: [],
  setOpenChatMessages: (newMessages?: DirectMessageType[]) =>
    set((state) => ({ openChatMessages: newMessages })),
}));
