import { useEffect, useState } from "react";
import { useProjectBaseStore } from "../stores/project-base.store";
import { useVoiceChatSocketStore } from "../stores/voice-chat-socket.store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";

export const ProjectChatVoiceCall: React.FC = () => {
  const chatInfo = useProjectBaseStore((state) => state.activeChannelInfo);
  const voiceSocket = useVoiceChatSocketStore();

  const [joiningRoom, setJoiningRoom] = useState(false);

  useEffect(() => {
    console.log("here", chatInfo);
    if (chatInfo != undefined) {
      console.log("joiningRoom");
      voiceSocket.initSocket(chatInfo.id);
    }
    // return () => {
    //   console.log("leaving room");
    //   voiceSocket.handleLeaveRoom(chatInfo?.id as string);
    //   voiceSocket.socket.disconnect();
    // };
  }, [, chatInfo]);

  if (!chatInfo)
    return (
      <div className="w-full h-full bg-base-200 shadow-md p-2 flex justify-center items-center">
        <LoadingSpinner size="small" />
      </div>
    );

  return (
    <div className="w-full h-full bg-base-200 shadow-md p-2 flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-3 p-3">
        {voiceSocket.channelPeerInfo.map((peer) => (
          <Image src={peer.avatar} width={120} height={120} key={peer.id} alt={peer.githubName} className="rounded-full p-1 border max-w-full"/>
        ))}
      </div>
      {voiceSocket.inRoom?
            <button
            className="btn btn-primary"
            onClick={() => voiceSocket.handleLeaveRoom(chatInfo.id)}
          >
            Leave Voice Call
          </button>
        :
        <button
        className="btn btn-primary"
        onClick={() => voiceSocket.handleJoinRoom(chatInfo.id)}
      >
        Join Voice Call
      </button>
    }


    </div>
  );
};
