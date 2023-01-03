import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetConnections = () => {

  return useQuery({
    queryKey: ["get-connections"],
    queryFn: () => {
      return axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/my-connections", { withCredentials: true })
        .then(res => res.data);
    }
  });
};