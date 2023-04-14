import { DashSearchResults } from "../search-results";
import { CreateProjectModal } from "../create-project-modal";
import { DashFeed } from "./feed";
import { useState } from "react";
import { FindProjectModal } from "../find-project.modal";

export const DashFindProjectLayout = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="w-full h-full">
      <div className="w-full h-16 py-1 px-3 z-20 flex items-center gap-5 rounded-sm mb-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search developers, projects or tags"
          className="input w-full"
        />
        <label htmlFor="find-project-modal" className="btn btn-secondary">
          Find me a project
        </label>
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
          <DashFeed />
        </div>
      )}
      <CreateProjectModal />
      <FindProjectModal />
    </div>
  );
};
