import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FindProjectFilters } from "./find-project-filters";
import { useGetAllTagsQuery } from "../hooks/useGetAllTagsQuery";

export const FindProject = () => {
  const [showFilters, setShowFilters] = useState(true);

  const getTagsQuery = useGetAllTagsQuery();

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col gap-4">
      {showFilters ? (
        <div className="w-full h-fit border-2 border-primary rounded-md">
          <div className="w-full h-8 flex justify-center">
            <button onClick={() => setShowFilters(false)}>
              <ChevronUpIcon className="w-6 h-6" />
            </button>
          </div>
          <FindProjectFilters />
        </div>
      ) : (
        <div className="w-full h-fit border-2 border-primary rounded-md">
          <div className="w-full h-8 flex justify-center">
            <button onClick={() => setShowFilters(true)}>
              <ChevronDownIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="w-full flex-auto bg-base-300"></div>
    </div>
  );
};
