import { useDevAuthStore } from "modules/auth/store/auth-store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useChatSocketStore } from "modules/sockets/chat.store";
import Image from "next/image";
import { useEffect } from "react";
import { useChatMessageStore } from "../stores/chat-message.store";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashChat } from "./chat";

export const DashChatFeed: React.FC = () => {
  const dashNavStore = useDashNavStore();

  const chats = useChatMessageStore((state) => state.chats);
  const developerId = useDevAuthStore((state) => state.devInfo?.id as string);

  const openChat = useChatSocketStore((state) => state.openChat);
  const openChatId = useChatMessageStore((state) => state.openChatId);
  const chatOpening = useChatMessageStore((state) => state.chatOpening);
  const chatInfo = useChatMessageStore(state => state.openChatInfo);
  const setChatOpening = useChatMessageStore(state => state.setChatOpening);

  useEffect(() => {
    if (chatInfo) setChatOpening(false);
  }, [chatInfo]);

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="w-full flex justify-center h-10">
        <div className="tabs">
          <a
            className="tab tab-bordered"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.FIND)}
          >
            Find A Project
          </a>
          <a
            className="tab tab-bordered"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.MY_PROJECTS)}
          >
            My Projects
          </a>
          <a
            className="tab tab-bordered tab-active"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.CHAT)}
          >
            Chats
          </a>
        </div>
      </div>
      <div className="w-full h-[calc(100%-2.5rem)] flex gap-2">
        <div className="flex flex-col gap-2 w-1/3 items-center">
          {chats.directMessageChats.map((chat) => {
            const otherDeveloper = chat.participants.find(
              (x) => x.id != developerId
            );
            const recentMessage =
              chat.messages.length > 0 ? chat.messages[0] : null;

            return (
              <div
                className={
                  openChatId == chat.id
                    ? "w-full p-2 bg-base-100 hover:bg-base-100 cursor-pointer flex gap-2 overflow-x-hidden items-center rounded-sm"
                    : "w-full p-2 hover:bg-base-100 cursor-pointer flex gap-2 overflow-x-hidden items-center rounded-sm"
                }
                key={chat.id}
                onClick={() => openChat(chat.id)}
              >
                <Image
                  src={otherDeveloper?.avatarURL as string}
                  width={40}
                  height={40}
                  alt="profile-picture"
                  className="rounded-full border p-1"
                />
                <div className="h-full w-[calc(100%-45px)] whitespace-nowrap">
                  <div className="text-white text-opacity-50">
                    {otherDeveloper?.name
                      ? otherDeveloper.name
                      : otherDeveloper?.githubUsername}
                  </div>
                  {recentMessage ? (
                    <div
                      className={
                        recentMessage.seen || recentMessage.sender.id == developerId
                          ? "text-white text-opacity-50 text-xs whitespace-nowrap w-full overflow-hidden"
                          : "text-white text-xs w-full overflow-hidden"
                      }
                    >
                      {recentMessage.sender.name
                        ? recentMessage.sender.name
                        : recentMessage.sender.githubUsername}
                      {": "}
                      {recentMessage.text}
                    </div>
                  ) : (
                    <div className="text-white text-opacity-50">
                      No messages
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-2/3 h-full">
          {chatOpening ? (
            <div className="w-full h-full flex justify-center items-center bg-base-200 shadow-md">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <div className="w-full h-full">
              <DashChat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
