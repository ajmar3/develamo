import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";

export interface IProjectFilterStore {
  tags: string[];
  addTag: (newTag: string) => void;
  removeTag: (removeTag: string) => void;
  allTags: { id: string, title: string }[];
  availableTags: { id: string, title: string }[];
  setAvailableTags: (tags: { id: string, title: string }[]) => void;
  setAllTags: (tags: { id: string, title: string }[]) => void;
  selectedTagInfo: { id: string, title: string }[];
  setSelectedTagInfo: (tags: { id: string, title: string }[]) => void;
}

export const useProjectFilterStore = create<IProjectFilterStore>(set => ({
  tags: [],
  addTag: (newTag: string) => set(state => ({ tags: [...state.tags, newTag] })),
  removeTag: (removeTag: string) => {
    set(state => ({ tags:  state.tags.filter(x => x != removeTag)}));
    set(state => ({ selectedTagInfo:  state.selectedTagInfo.filter(x => x.id != removeTag)}));
  },
  availableTags: [],
  allTags: [],
  setAvailableTags: (tags: { id: string, title: string }[]) => set(state => ({ availableTags: tags })),
  setAllTags: (tags: { id: string, title: string }[]) => set(state => ({ allTags: tags })),
  selectedTagInfo: [],
  setSelectedTagInfo: (tags: { id: string, title: string }[]) => set(state => ({ selectedTagInfo: tags }))
}));