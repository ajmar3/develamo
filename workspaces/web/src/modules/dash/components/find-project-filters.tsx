import { Combobox } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SearchBox } from "modules/common/components/search-box";
import { useEffect, useState } from "react";
import { useProjectFilterStore } from "../stores/filter.store";

export const FindProjectFilters = () => {
  const filterStore = useProjectFilterStore((state) => ({
    availableTags: state.availableTags,
    selectedTagInfo: state.selectedTagInfo,
    setSelectedTagInfo: state.setSelectedTagInfo,
    setAvailableTags: state.setAvailableTags,
    tags: state.tags,
    addTag: state.addTag,
  }));

  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    const newSelected = filterStore.selectedTagInfo;
    for (const tagId of filterStore.tags) {
      const matchingTag = filterStore.availableTags.find((x) => x.id == tagId);
      if (matchingTag) {
        newSelected.push(matchingTag);
      }
    }
    filterStore.setSelectedTagInfo(newSelected as any[]);

    const newAvailableList = filterStore.availableTags.filter(
      (x) => !filterStore.tags.includes(x.id)
    );
    filterStore.setAvailableTags(newAvailableList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStore.tags]);

  return (
    <div className="w-full h-full flex flex-col p-4 gap-6">
      <div className="flex flex-col gap-2">
        <div className="">Filter by tag:</div>
        <div className="w-1/2">
          <SearchBox
            options={filterStore.availableTags}
            selectOptionFunc={(args: string) => filterStore.addTag(args)}
          />
        </div>
        <div className="flex gap-2">
          {filterStore.selectedTagInfo.length > 0 &&
            filterStore.selectedTagInfo.map((tag) => (
              <div
                className="py-1 px-2 rounded-full border border-secondary"
                key={tag.id}
              >
                {tag.title}
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="">Filter by difficulty:</div>
        <div className="w-1/2">
          <input
            type="range"
            min="1"
            max="3"
            value={difficulty}
            className="range range-secondary"
            step="1"
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button className="btn btn-primary btn-sm">Apply</button>
      </div>
    </div>
  );
};
