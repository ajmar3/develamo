import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useGetConnections } from "./useGetConnectionsQuery";

export type ProjectFeedType = {
  id: string,
  title: string,
  description: string,
  finished: boolean,
  finishedAt?: string,
  createdAt: string,
  owner: {
    id: string,
    name?: string,
    githubUsername: string,
    avatarURL: string,
  },
  developers: {
    id: string,
    name?: string,
    githubUsername: string,
    avatarURL: string,
  }[],
  tags: {
    id: string,
    title: string
  }[]
  likes: {
    developer: {
      id: string
    }
  }[]
}[]

export const useGetProjectFeedMutation = () => {

  return useMutation({
    mutationFn: (model: { offset: number }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/project/project-feed", model, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data as ProjectFeedType;
        });
    },
  });
};
