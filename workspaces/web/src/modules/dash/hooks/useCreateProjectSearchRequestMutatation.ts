import { useMutation, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useFeedbackStore } from "modules/common/stores/feedback.store";
import { useState } from "react";

export type CreateProjectRequestType = {
  tagIds: string[]
  allTechnologies: boolean
}

export const useCreateProjectSearchRequestMutation = () => {

  const feedbackStore = useFeedbackStore();

  return useMutation({
    mutationFn: (model: CreateProjectRequestType) => {
      console.log(model)
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/project/create-project-search", model, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res)
          feedbackStore.addMessage({ message: res.data, statusCode: 200, error: "Success" });
          return res.data;
        })
        .catch((error) => {
          const data = error.response.data;
          feedbackStore.addMessage({ message: data.message, statusCode: data.statusCode, error: data.error });
        });
    },
  });
};
