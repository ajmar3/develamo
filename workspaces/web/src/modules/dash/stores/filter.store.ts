import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";

export interface IProjectFilterStore {
  tags: string[];
  addTag: (newTag: string) => void;
  removeTag: (removeTag: string) => void;
  
}

export const useProjectFilterStore = create<IProjectFilterStore>(set => ({
  tags: [],
  addTag: (newTag: string) => set(state => ({ tags: [...state.tags, newTag] })),
  removeTag: (removeTag: string) => set(state => ({ tags:  state.tags.filter(x => x != removeTag)})),
}));