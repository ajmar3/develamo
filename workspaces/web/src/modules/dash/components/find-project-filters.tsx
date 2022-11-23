import { PlusIcon } from "@heroicons/react/24/outline";
import { useProjectFilterStore } from "../stores/filter.store";

export const FindProjectFilters = () => {

  const filterStore = useProjectFilterStore();

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex flex-col gap-2">
        <div className="">Filter by tag</div>
        <div className="w-1/2">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search tags"
              className="input input-bordered input-sm"
            />
            <button className="btn btn-square btn-sm" disabled={true}>
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex gap-2"></div>
      </div>
    </div>
  );
};
