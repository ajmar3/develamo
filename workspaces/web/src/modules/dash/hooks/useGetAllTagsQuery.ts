import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCreateProjectStore } from "../stores/create-project.store";

export const useGetAllTagsQuery = () => {

  const setAllTags = useCreateProjectStore(state => state.setAllTags);

  return useQuery({
    queryKey: ["get-all-tags"],
    queryFn: () => {
      return axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "/project/tags/all", { withCredentials: true })
        .then(res => res.data)
        .then(data => {
          setAllTags(data);
          return data;
        });
    }
  });
};