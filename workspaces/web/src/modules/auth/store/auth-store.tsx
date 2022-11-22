import create from "zustand";

export interface IDevAuthStore {
  devInfo?: {
    id: string,
    email: string,
    name?: string,
    githubUsername: string,
    bio?: string,
    avatarURL: string
  }
}

export const useDevAuthStore = create<IDevAuthStore>(set => ({
  devInfo: undefined
}));