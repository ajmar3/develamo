import create from "zustand";

export interface IDevAuthStore {
  devInfo?: {
    id: string,
    email: string,
    name?: string,
    githubUsername: string,
    bio?: string,
    avatarURL: string
  },
  projectInfo?: {
    id: string
    developers: {
      id: string;
      githubUsername: string;
      name: string;
      avatarURL: string;
    }[];
    owner: {
      id: string;
      githubUsername: string;
      name: string;
      avatarURL: string;
    };
  },
  setInfo: (newInfo: any) => void;
}

export const useProjectAuthStore = create<IDevAuthStore>(set => ({
  devInfo: undefined,
  projectInfo: undefined,
  setInfo: (newInfo: any) => set(state => ({
    devInfo: newInfo.developer,
    projectInfo: newInfo.project,
  }))
}));