import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";
import { OwnedProjectType, ProjectApplicationType, ProjectType } from "../hooks/useGetMyProjectsQuery";

export interface IProjectStore {
  myProjects: ProjectType[]
  setMyProjects: (projects: ProjectType[]) => void;
  myOwnedProjects: OwnedProjectType[]
  setMyOwnedProjects: (projects: OwnedProjectType[]) => void;
  myProjectApplications: ProjectApplicationType[]
  setMyProjectApplications: (newData: ProjectApplicationType[]) => void
  addProjectApplication: (newApplication: ProjectApplicationType) => void
}

export const useProjectStrore = create<IProjectStore>(set => ({
  myProjects: [],
  setMyProjects: (projects: ProjectType[]) => set(state => ({ myProjects: projects })),
  myOwnedProjects: [],
  setMyOwnedProjects: (projects: OwnedProjectType[]) => set(state => ({ myOwnedProjects: projects })),
  myProjectApplications: [],
  setMyProjectApplications: (newData: ProjectApplicationType[]) => set(state => ({ myProjectApplications: newData })),
  addProjectApplication: (newApplication: ProjectApplicationType) => set(state => ({ myProjectApplications: [...state.myProjectApplications, newApplication] })),
}));