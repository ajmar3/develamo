import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "../stores/connections.store";

export type GetConnectionType = {
  connections: any[],
  requests: any[],
  sentRequests: any[]
}

export const useGetConnections = (enabled: boolean) => {

  const setConnections = useConnectionStore(state => state.setConnections);
  const setRequests = useConnectionStore(state => state.setConnectionRequests);
  const setSentRequests = useConnectionStore(state => state.setSentRequests);

  return useQuery<GetConnectionType>({
    queryKey: ["get-connections"],
    enabled: enabled,
    queryFn: () => {
      return axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/my-connections", { withCredentials: true })
        .then(res => {
          setConnections(res.data.connections);
          setRequests(res.data.requests);
          setSentRequests(res.data.sentRequests);
          return res.data;
        });
    }
  });
};