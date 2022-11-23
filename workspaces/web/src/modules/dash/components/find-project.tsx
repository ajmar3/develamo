import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FindProjectFilters } from "./find-project-filters";

export const FindProject = () => {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col">
      {showFilters ? (
        <div className="w-full h-fit">
          <div className="w-full h-8 flex justify-end">
            <button onClick={() => setShowFilters(false)}>
              <ChevronUpIcon className="w-6 h-6" />
            </button>
          </div>
          <FindProjectFilters />
        </div>
      ) : (
        <div className="w-full h-fit">
          <div className="w-full h-8 flex justify-end gap-6">
            <div className="text-lg">Filters...</div>
            <button onClick={() => setShowFilters(true)}>
              <ChevronDownIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="w-full flex-auto bg-red-600"></div>
    </div>
  );
};
