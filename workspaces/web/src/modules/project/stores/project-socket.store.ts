import { io, Socket } from "socket.io-client";
import create from "zustand";
import {
  EditProjectType,
  ProjectApplicationType,
  ProjectChatChannelType,
  ProjectChatMessageType,
  ProjectDeveloperType,
  ProjectInfoType,
  RemoveDevFromProjectType,
} from "../types/chat-types";
import { useProjectAdminStore } from "./project-admin.store";
import { useProjectBaseStore } from "./project-base.store";
import { useFeedbackStore } from "modules/common/stores/feedback.store";

export interface IProjectSocketStore {
  socket: Socket;
  initSocket: (data: { developerId: string; projectId: string }) => void;
  createChannel: (data: { projectId: string; name: string }) => void;
  createMessage: (data: { channelId: string; text: string }) => void;
  openChannel: (channelId: string) => void;
  getProjectApplication: (projectId: string) => void;
  acceptProjectApplication: (applicationId: string) => void;
  rejectProjectApplication: (applicationId: string) => void;
  leaveProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  editProject: (data: EditProjectType, projectId: string) => void;
  removeDeveloperFromProject: (data: RemoveDevFromProjectType) => void;
}

export const useProjectSocketStore = create<IProjectSocketStore>((set) => {
  const projectStore = useProjectBaseStore.getState();
  const projectAdminStore = useProjectAdminStore.getState();
  const feedbackStore = useFeedbackStore.getState();

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

  socket.on("project-edited", (data: EditProjectType) => {
    projectStore.editProjectInfo(data);
  });

  socket.on("removed-from-project", (id: string) => {
    projectStore.setRemovedFromProjectIndicator(true);
  });

  socket.on("project-deleted", () => {
    projectStore.setDeleteProjectIndicator(true);
  });

  socket.on("updated-developer-list", (newDevs: ProjectDeveloperType[]) => {
    projectStore.editProjectDevelopers(newDevs);
  });

  socket.on("error", (error) => {
    feedbackStore.addMessage(error);
  });

  return {
    socket: socket,
    initSocket: (data: { developerId: string; projectId: string }) => {
      socket.emit("connected", data);
    },
    createChannel: (data: { projectId: string; name: string }) => {
      socket.emit("create-channel", data);
    },
    createMessage: (data: { channelId: string; text: string }) => {
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
    },
    leaveProject: (projectId: string) => {
      socket.emit("leave-project", projectId);
    },
    deleteProject: (projectId: string) => {
      socket.emit("delete-project", projectId);
    },
    editProject: (data: EditProjectType, projectId: string) => {
      socket.emit("edit-project-info", {
        title: data.title,
        description: data.description,
        repoURL: data.repoURL,
        projectId: projectId,
      });
    },
    removeDeveloperFromProject: (data: RemoveDevFromProjectType) => {
      socket.emit("remove-developer-from-project", data);
    },
  };
});
