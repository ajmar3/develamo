import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { ProjectNavBar } from "./nav-bar";
import { useProjectSocketStore } from "../stores/project-socket.store";
import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectBaseStore } from "../stores/project-base.store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";

export type ProjectLayoutPropsType = {
  children: React.ReactNode;
};

export const ProjectLayout: React.FC<ProjectLayoutPropsType> = (props) => {
  const initProjectSocket = useProjectSocketStore((state) => state.initSocket);

  const developerId = useProjectAuthStore((state) => state.devInfo?.id);
  const projectId = useProjectAuthStore((state) => state.projectInfo?.id);
  const projectInfo = useProjectBaseStore((state) => state.projectInfo);

  useEffect(() => {
    if (developerId && projectId) {
      initProjectSocket({ developerId: developerId, projectId: projectId });
    }
  }, [, developerId, projectId]);

  if (!projectInfo) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-base-300  relative">
      <ProjectNavBar />
      <div className="max-w-8xl w-full flex flex-1 p-3 gap-4 overflow-y-scroll">
        <div className="w-full h-full">{props.children}</div>
      </div>
    </div>
  );
};
