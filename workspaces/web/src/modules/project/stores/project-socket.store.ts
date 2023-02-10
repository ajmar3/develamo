import { io, Socket } from "socket.io-client";
import create from "zustand";
import { ProjectApplicationType, ProjectChatChannelType, ProjectChatMessageType, ProjectInfoType } from "../types/chat-types";
import { useProjectAdminStore } from "./project-admin.store";
import { useProjectBaseStore } from "./project-base.store";

export interface IProjectSocketStore {
  socket: Socket;
  initSocket: (data: { developerId: string, projectId: string }) => void;
  createChannel: (data: { projectId: string, name: string }) => void;
  createMessage: (data: { channelId: string, text: string }) => void;
  openChannel: (channelId: string) => void;
  getProjectApplication: (projectId: string) => void;
  acceptProjectApplication: (applicationId: string) => void;
  rejectProjectApplication: (applicationId: string) => void;
}

export const useProjectSocketStore = create<IProjectSocketStore>((set) => {
  const projectStore = useProjectBaseStore.getState();
  const projectAdminStore = useProjectAdminStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_PROJECT_WEBSOCKET_URL as string, {
    withCredentials: true,
  });

  socket.on("project-info", (data: ProjectInfoType) => {
    projectStore.setProjectInfo(data);
    if (data.chat.channels.length > 0) {
      projectStore.setActiveChannelId(data.chat.channels[0].id);
      socket.emit("open-channel", data.chat.channels[0].id);
    }
  });

  socket.on("new-channel", (data: ProjectChatChannelType) => {
    projectStore.addChatInfoChannel(data);
  });
  
  socket.on("channel-opened", (data: ProjectChatChannelType) => {
    projectStore.setActiveChannelInfo(data);
    projectStore.setActiveChannelMessages(data.messages);
  });

  socket.on("new-message", (data: ProjectChatMessageType) => {
    projectStore.addActiveChannelMessage(data);
    projectStore.updateChannelMessage(data);
  });

  socket.on("project-application-updates", (data: ProjectApplicationType[]) => {
    projectAdminStore.setProjectApplications(data);
  });

  return {
    socket: socket,
    initSocket: (data: { developerId: string, projectId: string }) => {
      socket.emit("connected", data);
    },
    createChannel: (data: { projectId: string, name: string }) => {
      socket.emit("create-channel", data);
    },
    createMessage: (data: { channelId: string, text: string }) => {
      socket.emit("create-message", data);
    },
    openChannel: (channelId: string) => {
      projectStore.setActiveChannelId(channelId);
      projectStore.setActiveChannelInfo(undefined);
      socket.emit("open-channel", channelId);
    },
    getProjectApplication: (projectId: string) => {
      socket.emit("get-project-applications", projectId);
    },
    acceptProjectApplication: (applicationId: string) => {
      socket.emit("accept-project-application", applicationId);
    },
    rejectProjectApplication: (applicationId: string) => {
      socket.emit("reject-project-application", applicationId);
    }
  };
});
