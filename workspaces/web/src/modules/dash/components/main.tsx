import { useState } from "react";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashChatFeed } from "./chat-feed";
import { CreateProjectModal } from "./create-project-modal";
import { DashFeed } from "./feed";
import { DashMyProjects } from "./my-projects";
import { DashSearchResults } from "./search-results";

export const DashMain: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  const activeTab = useDashNavStore((state) => state.activeTab);

  const getTabElement = () => {
    if (activeTab == DashTabEnum.FIND) return <DashFeed />;
    if (activeTab == DashTabEnum.MY_PROJECTS) return <DashMyProjects />;
    if (activeTab == DashTabEnum.CHAT) return <DashChatFeed />;
  };

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
        <div className="w-full h-[calc(100%-5.5rem)]">
          {getTabElement()}
        </div>
      )}
      <CreateProjectModal />
    </div>
  );
};
