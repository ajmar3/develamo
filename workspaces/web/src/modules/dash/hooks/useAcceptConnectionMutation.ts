import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export const useAcceptConnectionMutation = () => {


  return useMutation({
    mutationFn: (model: { requestId: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/connection/accept-request", model, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        });
    },
  });
};
