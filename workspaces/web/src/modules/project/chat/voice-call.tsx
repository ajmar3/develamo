import { useEffect, useState } from "react";
import { useProjectBaseStore } from "../stores/project-base.store";
import { useVoiceChatSocketStore } from "../stores/voice-chat-socket.store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";

export const ProjectChatVoiceCall: React.FC = () => {
  const chatInfo = useProjectBaseStore((state) => state.activeChannelInfo);
  const voiceSocket = useVoiceChatSocketStore();

  const [joiningRoom, setJoiningRoom] = useState(false);

  useEffect(() => {
    if (chatInfo) {
      console.log("here", chatInfo.id);
      voiceSocket.initSocket(chatInfo.id);
    }
  });

  if (!chatInfo) return (
    <div className="w-full h-full bg-base-200 shadow-md p-2 flex justify-center items-center">
      <LoadingSpinner size="small" />
    </div>
  )

  return (
    <div className="w-full h-full bg-base-200 shadow-md p-2 flex flex-col justify-end">
      <button className="btn btn-primary" onClick={() => voiceSocket.handleJoinRoom(chatInfo.id)}>
        Join Voice Call
      </button>
    </div>
  );
};
