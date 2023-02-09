import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useProjectSocketStore } from "modules/project/stores/project-socket.store";

export const ChatChannelList: React.FC = () => {
  const developerId = useDevAuthStore((state) => state.devInfo?.id);
  const channels = useProjectBaseStore((state) => state.projectInfo?.chat.channels);
  const activeChannelId = useProjectBaseStore(
    (state) => state.activeChannelInfo?.id
  );
  const projectTitle = useProjectBaseStore((state) => state.projectInfo?.title);
  const openChannel = useProjectSocketStore(state => state.openChannel);

  const handleClick = (channelId: string) => {
    if (channelId) {
      openChannel(channelId);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="h-12 px-2 border-b flex justify-center">
        <div className="h-full w-full text-xl flex items-center mx-3 text-white whitespace-nowrap overflow-hidden">
          {projectTitle}
        </div>
      </div>
      <div className="w-full h-[calc(100%-48px)] overflow-y-scroll flex flex-col">
        {channels &&
          channels.map((channel) => {
            const activeChannel = activeChannelId == channel.id;
            return (
              <div
                key={channel.id}
                className={
                  activeChannel
                    ? "w-full py-3 bg-base-100 cursor-pointer flex items-center text-lg px-5 gap-2 text-white"
                    : "w-full py-3 hover:bg-base-100 cursor-pointer flex items-center text-lg px-5 gap-2"
                }
                onClick={() => handleClick(channel.id)}
              >
                <HashtagIcon className="w-5 h-5" />
                {channel.name}
              </div>
            );
          })}
        <div className="mt-2 mx- w-full flex justify-center">
          <label
            htmlFor="create-channel-modal"
            className="btn btn-secondary w-11/12"
          >
            Add Channel
          </label>
        </div>
      </div>
    </div>
  );
};
