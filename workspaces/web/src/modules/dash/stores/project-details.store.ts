import create from "zustand";
import { DashProjectCardType } from "../components/find/project-card";

export interface IProjectDetailsStore {
  projectInfo?: DashProjectCardType
  setProjectInfo: (info: DashProjectCardType) => void
  modalOpen: boolean,
  setModalOpen: (newState: boolean) => void
}

export const useProjectDetailsStore = create<IProjectDetailsStore>(set => ({
  setProjectInfo: (info: DashProjectCardType) => set(state => ({ projectInfo: info })),
  modalOpen: false,
  setModalOpen: (newState: boolean) => set(state => ({ modalOpen: newState }))
}));

