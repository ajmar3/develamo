import create from "zustand";

export enum DashTabEnum {
  FIND = 1,
  MY_PROJECTS = 2
}

export enum DashProfileTabEnum {
  SOCIAL = 1,
  MY_PROFILE = 2,
}

export interface IDashNavStore {
  selectedTab: DashTabEnum;
  setSelectedTab: (newTab: DashTabEnum) => void;
  selectedProfileTab: DashProfileTabEnum;
  setSelectedProfileTab: (newTab: DashProfileTabEnum) => void;
}

export const useDashNavStore = create<IDashNavStore>(set => ({
  selectedTab: DashTabEnum.FIND,
  setSelectedTab: (newTab: DashTabEnum) => set(state => ({ selectedTab: newTab })),
  selectedProfileTab: DashProfileTabEnum.SOCIAL,
  setSelectedProfileTab: (newTab: DashProfileTabEnum) => set(state => ({ selectedProfileTab: newTab }))
}));