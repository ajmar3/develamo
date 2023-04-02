import { DashNotifications } from "./notifications";
import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { DashNavBar } from "./nav-bar";
import { DashChat } from "./chat/chat";
import { useConnectionSocketStore } from "../stores/connection-socket.store";
import { useChatSocketStore } from "../stores/chat-socket.store";

export type DashLayoutPropsType = {
  children: React.ReactNode
}

export const DashLayout: React.FC<DashLayoutPropsType> = (props) => {
  const connectionSocket = useConnectionSocketStore();
  const chatSocket = useChatSocketStore();

  const developerId = useDevAuthStore(state => state.devInfo?.id);

  useEffect(() => {
    if (developerId) {
      connectionSocket.initSocket(developerId);
      chatSocket.initSocket(developerId);
    }
  }, [, developerId]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-base-300  relative">
      <DashNavBar />
      <div className="max-w-8xl w-full flex p-3 gap-4 h-full overflow-y-scroll">
        <div className="w-1/6 max-h-full h-fit pb-1 bg-base-200 shadow-lg sticky top-0">
          <DashNotifications />
        </div>
        <div className="w-1/2">
          {props.children}
        </div>
        <div className="w-1/3 flex flex-col gap-3 sticky top-0">
          <DashChat />
        </div>
      </div>
    </div>
  );
};
