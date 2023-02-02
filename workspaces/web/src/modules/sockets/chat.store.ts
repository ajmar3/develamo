import { useChatMessageStore } from "modules/dash/stores/chat-message.store";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import {
  ChatInfoType,
  ChatListDMType,
  ChatListProjectType,
  DirectMessageType,
} from "modules/common/types/chat.types";
import { DashTabEnum, useDashNavStore } from "modules/dash/stores/nav-store";

export interface IChatSocketStore {
  socket: Socket;
  createDirectMessageChat: (developerIds: string[]) => void;
  createDirectMessage: (data: { chatId: string; text: string }) => void;
  openChat: (chatId: string) => void;
  closeChat: () => void;
  initSocket: (developerId: string) => void;
}

export const useChatSocketStore = create<IChatSocketStore>((set) => {
  const chatStore = useChatMessageStore.getState();
  const dashNavStore = useDashNavStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL as string, {
    withCredentials: true,
  });

  socket.on(
    "new-chat-info",
    (data: {
      directMessageChats: ChatListDMType[];
      projectChats: ChatListProjectType[];
    }) => {
      chatStore.setChats(data);
    }
  );

  socket.on("new-chat", (data: ChatListDMType) => {
    chatStore.addDirectMessageChat(data);
  });

  socket.on("chat-opened", (data: ChatInfoType) => {
    console.log("bing", data)
    chatStore.setOpenChatInfo(data);
    chatStore.setOpenChatMessages(data.messages);
    socket.emit("view-direct-message", { chatId: data.id });
  });

  socket.on(
    "message-viewed-updates",
    (data: { chatId: string; newMessages: DirectMessageType[] }) => {
      chatStore.updateChatMessages(data);
      chatStore.setOpenChatMessages(data.newMessages);
    }
  );

  socket.on(
    "message-updates",
    (data: { chatId: string; newMessages: DirectMessageType[] }) => {
      chatStore.setOpenChatMessages(data.newMessages);
      chatStore.updateChatMessages(data);
      console.log("runnning", chatStore.openChatInfo)
      console.log("runnning", chatStore.openChatId)
      console.log("runnning", data.chatId)
      if (chatStore.openChatInfo && chatStore.openChatInfo.id == data.chatId) {
        socket.emit("view-direct-message", { chatId: data.chatId });
      }
    }
  );

  return {
    socket: socket,
    createDirectMessageChat: (developerIds: string[]) => {
      socket.emit("create-direct-message-chat", {
        developerIds: developerIds,
      });
    },
    createDirectMessage: (data: { chatId: string; text: string }) => {
      socket.emit("new-message", data);
    },
    openChat: (chatId: string) => {
      chatStore.setOpenChatId(chatId);
      chatStore.setChatOpening(true);
      socket.emit("open-chat", {
        chatId: chatId,
      });
    },
    closeChat: () => {
      chatStore.setOpenChatId(undefined);
      chatStore.setOpenChatInfo(undefined);
      chatStore.setOpenChatMessages(undefined);
    },
    initSocket: (developerId: any) => {
      socket.emit("connected", {
        developerId: developerId,
      });
    },
  };
});
