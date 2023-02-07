import { useConnectionSocketStore } from "modules/sockets/connection.store";
import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useChatSocketStore } from "modules/sockets/chat.store";
import { ProjectNavBar } from "./nav-bar";

export type ProjectLayoutPropsType = {
  children: React.ReactNode;
};

export const ProjectLayout: React.FC<ProjectLayoutPropsType> = (props) => {
  const connectionSocket = useConnectionSocketStore();
  const chatSocket = useChatSocketStore();

  const developerId = useDevAuthStore((state) => state.devInfo?.id);

  useEffect(() => {
    if (developerId) {
      connectionSocket.initSocket(developerId);
      chatSocket.initSocket(developerId);
    }
  }, [, developerId]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-base-300  relative">
      <ProjectNavBar />
      <div className="max-w-8xl w-full flex p-3 gap-4 h-full overflow-y-scroll">
        <div className="w-3/4 h-96 bg-green-500">{props.children}</div>
        <div className="w-1/4 h-96 flex flex-col gap-3 sticky top-0 bg-blue-400"></div>
      </div>
    </div>
  );
};
