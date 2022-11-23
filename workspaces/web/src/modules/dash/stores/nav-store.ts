import create from "zustand";

export enum DashTabEnum {
  FIND = 1,
  MY_PROJECTS = 2
}

export interface IDashNavStore {
  selectedTab: DashTabEnum;
  setSelectedTab: (newTab: DashTabEnum) => void;
}

export const useDashNavStore = create<IDashNavStore>(set => ({
  selectedTab: DashTabEnum.FIND,
  setSelectedTab: (newTab: DashTabEnum) => set(state => ({ selectedTab: newTab })),
}));