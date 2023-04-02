import create from "zustand";
import {
  EditProjectType,
  ProjectChatChannelType,
  ProjectChatMessageType,
  ProjectDeveloperType,
  ProjectInfoType,
} from "../types/chat-types";

export interface IProjectStore {
  projectInfo?: ProjectInfoType;
  setProjectInfo: (info: ProjectInfoType) => void;
  addChatInfoChannel: (newChannels: ProjectChatChannelType) => void;
  updateChannelMessage: (newMessage: ProjectChatMessageType) => void;
  activeChannelInfo?: ProjectChatChannelType;
  activeChannelId?: string;
  setActiveChannelId: (newId: string | undefined) => void;
  setActiveChannelInfo: (newInfo?: ProjectChatChannelType) => void;
  activeChannelMessages: ProjectChatMessageType[];
  setActiveChannelMessages: (newMessages: ProjectChatMessageType[]) => void;
  addActiveChannelMessage: (newMessage: ProjectChatMessageType) => void;
  deleteProjectIndicator: boolean;
  setDeleteProjectIndicator: (newState: boolean) => void;
  editProjectInfo: (info: EditProjectType) => void;
  removedFromProjectIndicator: boolean;
  setRemovedFromProjectIndicator: (newState: boolean) => void;
  editProjectDevelopers: (info: ProjectDeveloperType[]) => void;
  updateChannelInfo: (data: { id: string; name: string }) => void;
  updateChannelParticipants: (data: {
    id: string;
    participants: {
      id: string;
      name: string;
      githubUsername: string;
      avatarURL: string;
    }[];
    name: string;
  }) => void;
  removeChannel: (channelId: string) => void;
  addChannel: (data: ProjectChatChannelType) => void; 
}

export const useProjectBaseStore = create<IProjectStore>((set) => {
  return {
    setProjectInfo: (info: ProjectInfoType) =>
      set((state) => ({ projectInfo: info })),
    addChatInfoChannel: (newChannel: ProjectChatChannelType) =>
      set((state) => {
        const info = state.projectInfo;
        if (info) {
          const channels = info.chat.channels.map((x) => x);
          channels.push(newChannel);
          channels.sort(
            (a: ProjectChatChannelType, b: ProjectChatChannelType) => {
              return (
                new Date(a.createdAt).valueOf() -
                new Date(b.createdAt).valueOf()
              );
            }
          );
          info.chat.channels = channels;
        }
        return { projectInfo: info };
      }),
    updateChannelMessage: (newMessage: ProjectChatMessageType) =>
      set((state) => {
        const projectInfo = state.projectInfo;
        if (projectInfo) {
          const relativeChannel = projectInfo.chat.channels.findIndex(
            (x) => x.id == newMessage.channelId
          );
          if (relativeChannel) {
            projectInfo.chat.channels[relativeChannel].messages[0] = newMessage;
          }
        }
        return { projectInfo: projectInfo };
      }),
    setActiveChannelId: (newId: string | undefined) =>
      set((state) => ({ activeChannelId: newId })),
    setActiveChannelInfo: (newInfo: any) =>
      set((state) => ({ activeChannelInfo: newInfo })),
    activeChannelMessages: [],
    setActiveChannelMessages: (newMessages: any[]) =>
      set((state) => {
        newMessages.sort(
          (a: ProjectChatMessageType, b: ProjectChatMessageType) => {
            return new Date(a.sentAt).valueOf() - new Date(b.sentAt).valueOf();
          }
        );
        return { activeChannelMessages: newMessages };
      }),
    addActiveChannelMessage: (newMessage: ProjectChatMessageType) =>
      set((state) => {
        if (newMessage.channelId != state.activeChannelId) {
          return { activeChannelMessages: state.activeChannelMessages };
        }
        const currentState = state.activeChannelMessages;
        const updatedMessages = currentState.map((x) => x);
        updatedMessages.push(newMessage);
        updatedMessages.sort(
          (a: ProjectChatMessageType, b: ProjectChatMessageType) => {
            return new Date(a.sentAt).valueOf() - new Date(b.sentAt).valueOf();
          }
        );
        return { activeChannelMessages: updatedMessages };
      }),
    deleteProjectIndicator: false,
    setDeleteProjectIndicator: (newState: boolean) =>
      set((state) => ({ deleteProjectIndicator: newState })),
    editProjectInfo: (info: EditProjectType) =>
      set((state) => {
        if (!state.projectInfo) return { projectInfo: state.projectInfo };

        const currentAsString = JSON.stringify(state.projectInfo);
        const current: ProjectInfoType = JSON.parse(currentAsString);
        current.description = info.description;
        current.title = info.title;
        current.repoURL = info.repoURL;
        return { projectInfo: current };
      }),
    removedFromProjectIndicator: false,
    setRemovedFromProjectIndicator: (newState: boolean) =>
      set((state) => ({ removedFromProjectIndicator: newState })),
    editProjectDevelopers: (info: ProjectDeveloperType[]) =>
      set((state) => {
        if (!state.projectInfo) return { projectInfo: state.projectInfo };

        const currentAsString = JSON.stringify(state.projectInfo);
        const current: ProjectInfoType = JSON.parse(currentAsString);
        current.developers = info;
        return { projectInfo: current };
      }),
    updateChannelInfo: (data: { id: string; name: string }) =>
      set((state) => {
        const current: ProjectInfoType = JSON.parse(
          JSON.stringify(state.projectInfo)
        );
        const currentIndex = current.chat.channels.findIndex(
          (x) => x.id == data.id
        );
        if (currentIndex != -1)
          current.chat.channels[currentIndex].name = data.name;

        const currentActive: ProjectChatChannelType = JSON.parse(
          JSON.stringify(state.activeChannelInfo)
        );
        if (currentActive && currentActive.id == data.id) {
          currentActive.name = data.name;
          return { projectInfo: current, activeChannelInfo: currentActive };
        }

        return { projectInfo: current };
      }),
    updateChannelParticipants: (data: {
      id: string;
      participants: {
        id: string;
        name: string;
        githubUsername: string;
        avatarURL: string;
      }[];
      name: string;
    }) =>
      set((state) => {
        const current: ProjectInfoType = JSON.parse(
          JSON.stringify(state.projectInfo)
        );
        const currentIndex = current.chat.channels.findIndex(
          (x) => x.id == data.id
        );
        if (currentIndex != -1)
          current.chat.channels[currentIndex].participants = data.participants;

        const currentActive: ProjectChatChannelType = JSON.parse(
          JSON.stringify(state.activeChannelInfo)
        );
        if (currentActive && currentActive.id == data.id) {
          currentActive.participants = data.participants;
          return { projectInfo: current, activeChannelInfo: currentActive };
        }

        return { projectInfo: current };
      }),
    removeChannel: (channelId: string) =>
      set((state) => {
        const current: ProjectInfoType = JSON.parse(
          JSON.stringify(state.projectInfo)
        );
        const index = current.chat.channels.findIndex((x) => x.id == channelId);
        if (index != -1) {
          const firstHalf = current.chat.channels.slice(0, index);
          const secondHalf = current.chat.channels.slice(index + 1);
          current.chat.channels = firstHalf.concat(secondHalf);
        }
        return { projectInfo: current };
      }),
    addChannel: (data: ProjectChatChannelType) => set(state => {
      const current: ProjectInfoType = JSON.parse(
        JSON.stringify(state.projectInfo)
      );
      current.chat.channels.push(data);
      return { projectInfo: current };
    })
  };
});
