import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export type SearchResultsType = {
  developers: {
    id: string,
    email: string,
    githubUsername: string
    githubId: string
    bio: string
    name: string
    avatarURL: string
    createdAt: string
  }[],
  projects: any[]
}

export type SearchDeveloperResultsType = {
  id: string,
  email: string,
  githubUsername: string
  githubId: string
  bio: string
  name: string
  avatarURL: string
  createdAt: string
}[]

export const useSearchMutation = () => {

  return useMutation({
    mutationFn: (model: { input: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/search", model, {
          withCredentials: true,
        })
        .then((res) => res.data as SearchResultsType);
    },
  });
};
