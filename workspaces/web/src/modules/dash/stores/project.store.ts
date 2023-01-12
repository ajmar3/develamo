import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";
import { OwnedProjectType, ProjectType } from "../hooks/useGetMyProjectsQuery";

export interface IProjectStore {
  myProjects: ProjectType[]
  setMyProjects: (projects: ProjectType[]) => void;
  myOwnedProjects: OwnedProjectType[]
  setMyOwnedProjects: (projects: OwnedProjectType[]) => void;
}

export const useConnectionStore = create<IProjectStore>(set => ({
  myProjects: [],
  setMyProjects: (projects: ProjectType[]) => set(state => ({ myProjects: projects })),
  myOwnedProjects: [],
  setMyOwnedProjects: (projects: OwnedProjectType[]) => set(state => ({ myOwnedProjects: projects })),
}));