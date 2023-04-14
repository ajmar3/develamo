import { useEffect } from "react";
import { ProjectChatWindow } from "./chat-window";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useRouter } from "next/router";
import { ProjectChatVoiceCall } from "./voice-call";

export const ProjectChatLayout: React.FC = () => {

  const removedFromProjectIndicator = useProjectBaseStore(
    (state) => state.removedFromProjectIndicator
  );
  const router = useRouter();

  useEffect(() => {
    if (removedFromProjectIndicator) {
      router.push("/dash/find");
    }
  }, [removedFromProjectIndicator]);

  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-4/5 h-full"><ProjectChatWindow /></div>
      <div className="w-1/5 h-full sticky top-0">
        <ProjectChatVoiceCall />
      </div>
    </div>
  );
};
