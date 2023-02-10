import create from "zustand";
import { ProjectApplicationType } from "../types/chat-types";

export interface IProjectAdminStore {
  projectApplications: ProjectApplicationType[];
  setProjectApplications: (applic: ProjectApplicationType[]) => void;
}

export const useProjectAdminStore = create<IProjectAdminStore>((set) => ({
  projectApplications: [],
  setProjectApplications: (applications: ProjectApplicationType[]) =>
    set((state) => ({ projectApplications: applications })),
}));
