import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export type CreateProjectType = {
  title: string
  description: string
  tagIds: string[]
}

export const useCreateProjectMutation = () => {

  return useMutation({
    mutationFn: (model: CreateProjectType) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/project/create", model, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        });
    },
  });
};
