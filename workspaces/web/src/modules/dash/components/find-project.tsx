import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { FindProjectFilters } from "./find-project-filters";
import { useGetAllTagsQuery } from "../hooks/useGetAllTagsQuery";
import { Menu } from "@headlessui/react";

export const FindProject = () => {
  const [showFilters, setShowFilters] = useState(true);

  const getTagsQuery = useGetAllTagsQuery();

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col gap-4">
      <FindProjectFilters />
    </div>
  );
};
