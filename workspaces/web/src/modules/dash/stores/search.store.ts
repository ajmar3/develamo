import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";
import {
  OwnedProjectType,
  ProjectApplicationType,
  ProjectType,
} from "../hooks/useGetMyProjectsQuery";

export type SearchResultsType = {
  developers: SearchDeveloperResultsType[];
  projects: ProjectSearchResultsType[];
};

export type SearchDeveloperResultsType = {
  id: string;
  email: string;
  githubUsername: string;
  githubId: string;
  bio: string;
  name: string;
  avatarURL: string;
  createdAt: string;
};

export type ProjectSearchResultsType = {
  id: string;
  title: string;
  description: string;
  finished: boolean;
  finishedAt?: string;
  createdAt: string;
  owner: {
    id: string;
    name?: string;
    githubUsername: string;
    avatarURL: string;
  };
  developers: {
    id: string;
    name?: string;
    githubUsername: string;
    avatarURL: string;
  }[];
  tags: {
    id: string;
    title: string;
  }[];
  likes: {
    developerId: string;
  }[];
};

export interface ISearchStore {
  searchResults: SearchResultsType;
  setSearchResults: (data: SearchResultsType) => void;
  feedResults: ProjectSearchResultsType[];
  setFeedResults: (data: ProjectSearchResultsType[]) => void;
  updateProjectLikes: (data: {
    id: string;
    likes: {
      id: string;
      developerId: string;
    }[];
  }) => void;
}

export const useSearchStore = create<ISearchStore>((set) => ({
  searchResults: { developers: [], projects: [] },
  setSearchResults: (data: SearchResultsType) =>
    set((state) => ({ searchResults: data })),
  feedResults: [],
  setFeedResults: (data: ProjectSearchResultsType[]) =>
    set((state) => ({ feedResults: data })),
  updateProjectLikes: (data: {
    id: string;
    likes: {
      id: string;
      developerId: string;
    }[];
  }) =>
    set((state) => {
      const feedCurrent = JSON.parse(JSON.stringify(state.feedResults));
      const feedIndex = feedCurrent.findIndex((x: any) => x.id == data.id);
      if (feedIndex != -1) {
        feedCurrent[feedIndex].likes = data.likes;
        return ({ feedResults: feedCurrent });
      }
      else {
        const current: SearchResultsType = JSON.parse(
          JSON.stringify(state.searchResults)
        );
        const index = current.projects.findIndex((x) => x.id == data.id);
        if (index != -1) {
          current.projects[index].likes = data.likes;
        } 
        return { searchResults: current };
      }
    }),
}));
