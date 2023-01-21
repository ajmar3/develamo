import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useEffect, useRef, useState } from "react";
import { useChatMessageStore } from "../stores/chat-message.store";
import Image from "next/image";
import { useChatSocketStore } from "modules/sockets/chat.store";
import { DirectMessageType } from "modules/common/types/chat.types";

export const DashChat: React.FC = () => {
  const [newMessageInput, setNewMessageInput] = useState("");
  const [sendEnabled, setSendEnabled] = useState(true);
  const [messages, setMessages] = useState<DirectMessageType[]>([]);
  const scrollRef = useRef<any>(null);

  const chatInfo = useChatMessageStore((state) => state.openChatInfo);
  const chatMessages = useChatMessageStore((state) => state.openChatMessages);
  const developerId = useDevAuthStore((state) => state.devInfo?.id as string);

  const createMessage = useChatSocketStore(
    (state) => state.createDirectMessage
  );

  useEffect(() => {
    setNewMessageInput("");
  }, []);

  useEffect(() => {
    setMessages(chatMessages.reverse());
  }, [chatMessages]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (sendEnabled == false) {
      setTimeout(() => {
        setSendEnabled(true);
      }, 1000);
    }
  }, [sendEnabled]);

  if (!chatInfo)
    return (
      <div className="w-full h-full bg-base-200 shadow-md flex justify-center items-center">
        Open a chat to get started!
      </div>
    );

  const otherDeveloper = chatInfo.participants.find((x) => x.id != developerId);

  const sendMessage = () => {
    if (!newMessageInput) return;
    if (!sendEnabled) {
      console.log("send blocked");
      return;
    }
    createMessage({
      chatId: chatInfo.id,
      text: newMessageInput,
    });
    setSendEnabled(false);
    setNewMessageInput("");
    console.log("sent");
  };

  return (
    <div className="w-full h-full bg-base-200 shadow-md flex flex-col justify-between">
      <div className="w-full bg-base-100 flex justify-end items-center gap-3 h-12 mb-2 px-3">
        <div className="text-white">
          {otherDeveloper?.name
            ? otherDeveloper.name
            : otherDeveloper?.githubUsername}
        </div>
        <Image
          src={otherDeveloper?.avatarURL as string}
          width={35}
          height={35}
          alt="profile-picture"
          className="rounded-full border p-1"
        />
      </div>
      <div className="h-[calc(100%-7.5rem)] w-full flex flex-col gap-3 overflow-y-scroll p-3">
        {messages.length > 0 ? (
          <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender.id == developerId
                  ? "w-full flex justify-end"
                  : "w-full flex justify-start"
              }
            >
              <div
                className={
                  message.sender.id == developerId
                    ? "bg-primary text-white rounded-lg p-2 w-fit text-right"
                    : "bg-base-100 text-white rounded-lg p-2"
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
