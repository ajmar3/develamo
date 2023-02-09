import { useEffect } from "react";
import { ProjectChatWindow } from "./chat-window";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";

export const ProjectChatLayout: React.FC = () => {

  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-4/5 h-full"><ProjectChatWindow /></div>
      <div className="w-1/5 h-full flex flex-col gap-3 sticky top-0 bg-base-200 shadow-md"></div>
    </div>
  );
};
