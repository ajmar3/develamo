import { useState } from "react";
import { useGetConnections } from "../hooks/useGetConnectionsQuery";
import { DashConnections } from "./connections";
import { DashPeopleSearchResults } from "./people-search";

export const DashPeople: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  const connectionsQuery = useGetConnections(true);

  return (
    <div className="w-full p-4 flex flex-col gap-3">
      <div className="text-lg">People</div>
      <div className="w-full flex">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search other developers..."
          className="input w-full"
        />
      </div>
      {searchInput ? (
        <div className="w-full h-full">
          <DashPeopleSearchResults search={searchInput} />
        </div>
      ) : (
        <div className="w-full">
          <DashConnections />
        </div>
      )}
    </div>
  );
};
