import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useGetConnections } from "./useGetConnectionsQuery";

export const useRejectConnectionMutation = () => {

  const [enabled, setEnabled] = useState(false);
  const getConsQuery = useGetConnections(enabled);

  return useMutation({
    mutationFn: (model: { requestId: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/reject-request", model, {
          withCredentials: true,
        })
        .then((res) => {
          setEnabled(true);
          return res.data;
        });
    },
  });
};
