import create from "zustand";

export enum DashTabEnum {
  FIND = 1,
  MY_PROJECTS = 2,
  CHAT = 3
}


export interface IDashNavStore {
  activeTab: DashTabEnum;
  setActiveTab: (newTab: DashTabEnum) => void;
}

export const useDashNavStore = create<IDashNavStore>(set => ({
  activeTab: DashTabEnum.FIND,
  setActiveTab: (newTab: DashTabEnum) => set(state => ({ activeTab: newTab })),
}));