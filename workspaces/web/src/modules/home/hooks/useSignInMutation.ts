import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (model: { code: string }) => {
      return axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/oauth", model, { withCredentials: true }).then(res => res.data);
    }
  });
};