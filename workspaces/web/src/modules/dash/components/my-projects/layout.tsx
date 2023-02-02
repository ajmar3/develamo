import { useActionSocketStore } from "modules/sockets/actions.store";
import { useEffect, useState } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useChatSocketStore } from "modules/sockets/chat.store";
import { DashMyProjects } from "./my-projects";
import { DashSearchResults } from "../search-results";
import { CreateProjectModal } from "../create-project-modal";

export const DashMyProjectLayout = () => {
  const actionSocket = useActionSocketStore();
  const chatSocket = useChatSocketStore();

  const developerId = useDevAuthStore((state) => state.devInfo?.id);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (developerId) {
      actionSocket.initSocket(developerId);
      chatSocket.initSocket(developerId);
    }
  }, [, developerId]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-20 p-3 bg-base-200 z-20 flex items-center gap-5 rounded-sm mb-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search developers, projects or tags"
          className="input w-full"
        />
        <label htmlFor="create-project-modal" className="btn btn-primary">
          Create Project
        </label>
      </div>
      {searchInput ? (
        <div className="w-full">
          <DashSearchResults search={searchInput} />
        </div>
      ) : (
        <div className="w-full h-[calc(100%-5rem)]">
          <DashMyProjects />
        </div>
      )}
      <CreateProjectModal />
    </div>
  );
};
