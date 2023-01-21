import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

export const useRejectConnectionMutation = () => {

  return useMutation({
    mutationFn: (model: { requestId: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/reject-request", model, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        });
    },
  });
};
