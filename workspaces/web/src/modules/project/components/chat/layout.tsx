import { useConnectionSocketStore } from "modules/sockets/connection.store";
import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useChatSocketStore } from "modules/sockets/chat.store";

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

  return <div className="w-full h-full bg-green-400"></div>;
};
