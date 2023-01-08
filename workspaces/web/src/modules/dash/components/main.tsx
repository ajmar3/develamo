import { useState } from "react";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashFeed } from "./feed";
import { DashSearchResults } from "./search-results";

export const DashMain: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  const activeTab = useDashNavStore((state) => state.activeTab);
  const setActiveTab = useDashNavStore((state) => state.setActiveTab);

  return (
    <div className="w-full h-full">
      <div className="w-full p-3 sticky top-0 bg-base-200 z-20">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search developers, projects or tags"
          className="input w-full"
        />
      </div>
      {searchInput ? (
        <div className="w-full">
          <DashSearchResults search={searchInput} />
        </div>
      ) : (
        <div className="w-full">
          <DashFeed />
        </div>
      )}
    </div>
  );
};
