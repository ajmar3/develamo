import { useDevAuthStore } from "modules/auth/store/auth-store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { ChatListDMType } from "modules/common/types/chat.types";
import { useChatSocketStore } from "modules/dash/stores/chat-socket.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useChatMessageStore } from "../../stores/chat-message.store";
import { DashTabEnum, useDashNavStore } from "../../stores/nav-store";
import { DashChatMessenger } from "./chat-messenger";

export const DashChat: React.FC = () => {
  const [filteredChats, setFilteredChats] = useState<ChatListDMType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const chats = useChatMessageStore((state) => state.chats);
  const developerId = useDevAuthStore((state) => state.devInfo?.id as string);

  const openChat = useChatSocketStore((state) => state.openChat);
  const openChatId = useChatMessageStore((state) => state.openChatId);
  const chatOpening = useChatMessageStore((state) => state.chatOpening);
  const chatInfo = useChatMessageStore((state) => state.openChatInfo);
  const setChatOpening = useChatMessageStore((state) => state.setChatOpening);

  useEffect(() => {
    if (chatInfo) setChatOpening(false);
  }, [chatInfo]);

  useEffect(() => {
    const newDisplayChats = chats.directMessageChats.filter((x) => {
      const otherDeveloper = x.participants.find((x) => x.id != developerId);
      return otherDeveloper?.name
        ? otherDeveloper.name
            .toLowerCase()
            .includes(searchInput.toLocaleLowerCase())
        : otherDeveloper?.githubUsername
            .toLowerCase()
            .includes(searchInput.toLocaleLowerCase());
    });
    setFilteredChats(newDisplayChats);
  }, [, searchInput, chats]);

  if (chatOpening)
    return (
      <div className="w-full h-full flex justify-center items-center bg-base-200 shadow-md">
        <LoadingSpinner size="medium" />
      </div>
    );

  if (chatInfo && openChatId) return <DashChatMessenger />;

  return (
    <div className="w-full h-full overflow-y-scroll bg-base-200 p-2">
      <div className="w-full mb-2">
        <input
          type="text"
          placeholder="Search for chats"
          className="input input-bordered w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 w-full items-center">
        {filteredChats.map((chat) => {
          const otherDeveloper = chat.participants.find(
            (x) => x.id != developerId
          );
          const recentMessage =
            chat.messages.length > 0 ? chat.messages[0] : null;

          return (
            <div
              className="w-full p-2 hover:bg-base-100 cursor-pointer flex gap-2 overflow-x-hidden items-center rounded-sm"
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
                      recentMessage.seen ||
                      recentMessage.sender.id == developerId
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
                  <div className="text-white text-opacity-50">No messages</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
