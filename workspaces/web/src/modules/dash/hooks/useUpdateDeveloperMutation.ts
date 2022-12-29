import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDevAuthStore } from "modules/auth/store/auth-store";

export const useUpdateDeveloperMutation = () => {

  const userInfo = useDevAuthStore(state => state.devInfo);

  return useMutation({
    mutationFn: (model: { name: string; bio: string }) => {
      return axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/developer/update", model, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .then(data => {
          useDevAuthStore.setState({
            devInfo: {
              id: data.id,
              name: data.name,
              bio: data.bio,
              email: data.email,
              avatarURL: data.avatarURL,
              githubUsername: data.githubUsername
            }
          })
        });
    },
  });
};
