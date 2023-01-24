import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserProjectQuery } from "../hooks/useUserProjectQuery";
import { useUserQuery } from "../hooks/useUserQuery";
import { useDevAuthStore } from "../store/auth-store";
import { useProjectAuthStore } from "../store/project-auth-store";

interface IDevAuth {
  children: React.ReactNode;
}

export const ProjectAuthProvider: React.FC<IDevAuth> = (props) => {
  const router = useRouter();
  const { id: projectId } = router.query;
  const [enabled, setEnabled] = useState(false);
  
  const { data, error, isLoading } = useUserProjectQuery(projectId as string, enabled);

  const projectAuthStore = useProjectAuthStore();

  if (error) {
    router.push('/');
  }

  useEffect(() => {
    if (data && (!projectAuthStore.devInfo?.id || projectAuthStore.projectInfo)) {
      projectAuthStore.setInfo(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (projectId) setEnabled(true);
  }, [projectId]);


  if(isLoading || !projectAuthStore.devInfo || !projectAuthStore.projectInfo) {
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
