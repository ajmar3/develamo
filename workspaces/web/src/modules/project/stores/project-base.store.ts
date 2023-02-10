import create from "zustand";
import {
  ProjectChatChannelType,
  ProjectChatMessageType,
  ProjectInfoType,
} from "../types/chat-types";

export interface IProjectStore {
  projectInfo?: ProjectInfoType;
  setProjectInfo: (info: ProjectInfoType) => void;
  addChatInfoChannel: (newChannels: ProjectChatChannelType) => void;
  updateChannelMessage: (newMessage: ProjectChatMessageType) => void;
  activeChannelInfo?: ProjectChatChannelType;
  activeChannelId?: string;
  setActiveChannelId: (newId: string) => void;
  setActiveChannelInfo: (newInfo?: ProjectChatChannelType) => void;
  activeChannelMessages: ProjectChatMessageType[];
  setActiveChannelMessages: (newMessages: ProjectChatMessageType[]) => void;
  addActiveChannelMessage: (newMessage: ProjectChatMessageType) => void;
}

export const useProjectBaseStore = create<IProjectStore>((set) => {
  return {
    setProjectInfo: (info: ProjectInfoType) =>
      set((state) => ({ projectInfo: info })),
    addChatInfoChannel: (newChannel: ProjectChatChannelType) =>
      set((state) => {
        const info = state.projectInfo;
        if (info) {
          const channels = info.chat.channels.map(x => x);
          channels.push(newChannel);
          channels.sort((a: ProjectChatChannelType, b: ProjectChatChannelType) => {
            return (
              new Date(a.createdAt).valueOf() -
              new Date(b.createdAt).valueOf()
            );
          });
          info.chat.channels = channels;
        }
        return { projectInfo: info };
      }),
    updateChannelMessage: (newMessage: ProjectChatMessageType) => set(state => {
      const projectInfo = state.projectInfo;
      if (projectInfo) {
        const relativeChannel = projectInfo.chat.channels.findIndex(x => x.id == newMessage.channelId);
        if (relativeChannel) {
          projectInfo.chat.channels[relativeChannel].messages[0] = newMessage;
        }
      }
      return { projectInfo: projectInfo };
    }),
    setActiveChannelId: (newId: string) => set(state => ({ activeChannelId: newId })),
    setActiveChannelInfo: (newInfo: any) =>
      set((state) => ({ activeChannelInfo: newInfo })),
      activeChannelMessages: [],
    setActiveChannelMessages: (newMessages: any[]) =>
      set((state) => {
        newMessages.sort((a: ProjectChatMessageType, b: ProjectChatMessageType) => {
          return (
            new Date(a.sentAt).valueOf() -
            new Date(b.sentAt).valueOf()
          );
        });
        return { activeChannelMessages: newMessages };
      }),
    addActiveChannelMessage: (newMessage: ProjectChatMessageType) => set(state => {
      if (newMessage.channelId != state.activeChannelId) {
        return ({ activeChannelMessages: state.activeChannelMessages });
      }
      const currentState = state.activeChannelMessages;
      const updatedMessages = currentState.map(x => x);
      updatedMessages.push(newMessage);
      updatedMessages.sort((a: ProjectChatMessageType, b: ProjectChatMessageType) => {
        return (
          new Date(a.sentAt).valueOf() -
          new Date(b.sentAt).valueOf()
        );
      });
      return ({ activeChannelMessages: updatedMessages });
    })
  };
});
