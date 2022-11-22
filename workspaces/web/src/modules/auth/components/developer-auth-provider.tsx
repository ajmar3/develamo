import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserQuery } from "../hooks/useUserQuery";
import { useDevAuthStore } from "../store/auth-store";

interface IDevAuth {
  children: React.ReactNode;
}

export const DevAuthProvider: React.FC<IDevAuth> = (props) => {

  const router = useRouter();
  
  const { data, error, isLoading } = useUserQuery();

  const devAuthStore = useDevAuthStore();

  if (error) {
    router.push('/');
  }

  useEffect(() => {
    if (data && !devAuthStore.devInfo?.id) {
      useDevAuthStore.setState({
        devInfo: {
          id: data.id,
          name: data.name,
          bio: data.bio,
          email: data.email,
          avatarURL: data.avatarURL,
          githubUsername: data.githubUsername
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  if(isLoading || !devAuthStore.devInfo?.id) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return(
    <>
      {props.children}
    </>
  );
};
