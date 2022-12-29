import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["verify-user"],
    queryFn: () => {
      return axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/me", {
          withCredentials: true,
        })
        .then((res) => res.data);
    },
  });
};
