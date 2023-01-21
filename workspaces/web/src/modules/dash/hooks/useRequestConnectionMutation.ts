import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRequestConnectionMutation = () => {

  return useMutation({
    mutationFn: (model: { requestedId: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/create-request", model, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        });
    },
  });
};
