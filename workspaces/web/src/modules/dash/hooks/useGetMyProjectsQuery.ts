import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type MyConnectionsType = {
  ownedProjects: OwnedProjectType[]
  projects: ProjectType[]
  projectSearchRequestAns: FindProjectRequestAnswerType[]
}

export type FindProjectRequestAnswerType = {
  id: string,
  createdAt: string;
  project: ProjectType;
}

export type ProjectType = {
  id: string,
  createdAt: string;
  title: string
  tags: {
    title: string
    id: string
  }[]
  description: string
  finished: boolean
  finishedAt: string
  developers: {
    id: string
    name: string
    avatarURL: string
    githubUsername: string
  }[]
  likes: {
    id: string
  }[]
  owner: {
    id: string
    name: string
    avatarURL: string
    githubUsername: string
  }
}

export type OwnedProjectType = {
  id: string,
  createdAt: string;
  title: string
  tags: {
    title: string
    id: string
  }[]
  description: string
  finished: boolean
  finishedAt: string
  developers: {
    id: string
    name: string
    avatarURL: string
    githubUsername: string
  }[]
  likes: {
    id: string
  }[]
}

export type ProjectApplicationType = {
  id: string
  requesterId:  string
  projectId: string
  createdAt: Date
  resolved:  boolean
  resolvedAt?: Date
  successful: boolean
}

export const useGetMyProjectsQuery = () => {

  return useQuery<MyConnectionsType>({
    queryKey: ["get-my-connections"],
    queryFn: () => {
      return axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "/project/my-projects", { withCredentials: true })
        .then(res => {
          return res.data;
        });
    }
  });
};