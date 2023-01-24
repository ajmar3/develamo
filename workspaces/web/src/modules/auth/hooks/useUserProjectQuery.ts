import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ProjectAuthQueryType = {
  developer: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
    bio: string;
    email: string;
  };
  project: {
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
  };
};

export const useUserProjectQuery = (projectId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["verify-user-project"],
    enabled: enabled,
    queryFn: () => {
      return axios
        .get(
          process.env.NEXT_PUBLIC_SERVER_URL +
            "/auth/project/" +
            projectId +
            "/me",
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data as ProjectAuthQueryType);
    },
  });
};
