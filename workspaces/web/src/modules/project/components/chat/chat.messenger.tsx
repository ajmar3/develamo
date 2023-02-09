import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DirectMessageType } from "modules/common/types/chat.types";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ProjectChatMessageType } from "modules/project/types/chat-types";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectSocketStore } from "modules/project/stores/project-socket.store";

export const ProjectChatMessenger: React.FC = () => {
  const [newMessageInput, setNewMessageInput] = useState("");
  const [sendEnabled, setSendEnabled] = useState(true);
  const [messages, setMessages] = useState<ProjectChatMessageType[]>([]);
  const scrollRef = useRef<any>(null);

  const channelInfo = useProjectBaseStore((state) => state.activeChannelInfo);
  const developerId = useProjectAuthStore((state) => state.devInfo?.id);

  const createMessage = useProjectSocketStore(
    (state) => state.createMessage
  );

  useEffect(() => {
    setNewMessageInput("");
  }, []);

  useEffect(() => {
    if (channelInfo) {
      const temp = channelInfo.messages.map(x => x);
      setMessages(temp.reverse());
    }
  }, [channelInfo?.messages]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({
        behaviour: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [channelInfo?.messages]);

  useEffect(() => {
    if (sendEnabled == false) {
      setTimeout(() => {
        setSendEnabled(true);
      }, 1000);
    }
  }, [sendEnabled]);

  if (!channelInfo)
    return (
      <div className="w-full h-full bg-base-200 shadow-md flex justify-center items-center">
        Open a chat to get started!
      </div>
    );

  const otherDeveloper = channelInfo.participants.find(
    (x) => x.id != developerId
  );

  const sendMessage = () => {
    if (!newMessageInput) return;
    if (!sendEnabled) {
      return;
    }
    createMessage({
      channelId: channelInfo.id,
      text: newMessageInput,
    });
    setSendEnabled(false);
    setNewMessageInput("");
  };

  return (
    <div className="w-full h-full bg-base-200 shadow-md flex flex-col justify-between">
      <div className="w-full flex bg-base-100 justify-between items-center h-12 px-3">
        <div className="flex items-center gap-3">
          <div className="text-white text-lg">{channelInfo.name}</div>
          <div className="flex items-center gap-1">
            {channelInfo.participants.map((x) => (
              <Image
                key={x.id}
                src={x.avatarURL}
                width={40}
                height={40}
                alt="profile-picture"
                className="rounded-full border p-1"
              />
            ))}
          </div>
        </div>
        <EllipsisVerticalIcon className="w-8 h-8 cursor-pointer" />
      </div>
      <div className="h-[calc(100%-7.5rem)] w-full flex flex-col gap-3 overflow-y-scroll p-3">
        {channelInfo.messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender.id == developerId
                    ? "chat chat-end"
                    : "chat chat-start"
                }
              >
                <div className="chat-image avatar">
                  <Image
                    className="rounded-full"
                    width={30}
                    height={30}
                    src={message.sender.avatarURL}
                    alt="profile-pciture"
                  />
                </div>
                <div
                  className={
                    message.sender.id == developerId
                      ? "bg-primary chat-bubble"
                      : "chat-bubble"
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            No messages. Say &apos;hi&apos; now!
          </div>
        )}
      </div>
      <div className="h-16 w-full bg-base-100 flex items-center px-2 gap-2">
        <input
          className="input input-primary flex-1"
          onKeyDown={(e) => {
            if (e.key == "Enter") sendMessage();
          }}
          onChange={(e) => setNewMessageInput(e.target.value)}
          value={newMessageInput}
        />
        <button className="btn btn-primary" onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
};
