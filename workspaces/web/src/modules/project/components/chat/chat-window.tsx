import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { ChatChannelList } from "./chat-channel-list";
import { CreateChannelModal } from "./create-channel-modal";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { ProjectChatMessenger } from "./chat.messenger";
import { LoadingSpinner } from "modules/common/components/loading-spinner";

export const ProjectChatWindow: React.FC = () => {
  const activeChatInfo = useProjectBaseStore(
    (state) => state.activeChannelInfo
  );
  const activeChatId = useProjectBaseStore((state) => state.activeChannelId);

  const getMessengerTab = () => {
    if (activeChatInfo) return <ProjectChatMessenger />;
    if (activeChatId)
      return (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner size="small" />
        </div>
      );
    else
      return (
        <div className="w-full h-full flex justify-center items-center border-l">
          Open a chat to get started!
        </div>
      );
  };

  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-1/4 h-full">
        <ChatChannelList />
      </div>
      <div className="w-3/4 h-full">{getMessengerTab()}</div>
      <CreateChannelModal />
    </div>
  );
};
