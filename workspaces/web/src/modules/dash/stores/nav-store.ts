import create from "zustand";

export enum DashTabEnum {
  FIND = 1,
  MY_PROJECTS = 2,
}

export enum DashSocialTabEnum {
  NOTIFICATIONs = 1,
  CHAT = 2,
}

export interface IDashNavStore {
  activeTab: DashTabEnum;
  setActiveTab: (newTab: DashTabEnum) => void;
  activeSocialTab: DashSocialTabEnum;
  setActiveSocialTab: (newTab: DashSocialTabEnum) => void
}

export const useDashNavStore = create<IDashNavStore>(set => ({
  activeTab: DashTabEnum.FIND,
  setActiveTab: (newTab: DashTabEnum) => set(state => ({ activeTab: newTab })),
  activeSocialTab: DashSocialTabEnum.NOTIFICATIONs,
  setActiveSocialTab: (newTab: DashSocialTabEnum) => set(state => ({ activeSocialTab: newTab })),
}));