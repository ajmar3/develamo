import { Combobox, Menu } from "@headlessui/react";
import { FunnelIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
    removeTag: state.removeTag,
    allTags: state.allTags
  }));

  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    const newSelected = [];
    for (const tagId of filterStore.tags) {
      const matchingTag = filterStore.allTags.find((x) => x.id == tagId);
      if (matchingTag) {
        newSelected.push(matchingTag);
      }
    }
    filterStore.setSelectedTagInfo(newSelected as any[]);
    const newAvailableList = filterStore.allTags.filter(
      (x) => !filterStore.tags.includes(x.id)
    );
    console.log(newAvailableList)
    filterStore.setAvailableTags(newAvailableList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStore.tags]);


  return (
    <div className="dropdown min-w-96">
      <label tabIndex={0} className="btn btn-primary">
        <FunnelIcon className="w-6 h-6 mr-2" />
        Filters
      </label>
      <div
        tabIndex={0}
        className="dropdown-content p-4 shadow bg-base-200 rounded-box mt-1"
      >
        <div className="flex flex-col gap-2">
          <div className="text-lg">Technology Tags</div>
          <div>
            <SearchBox
              options={filterStore.availableTags}
              selectOptionFunc={(args: string) => filterStore.addTag(args)}
            />
          </div>
          <div className="flex gap-2">
            {filterStore.selectedTagInfo.length > 0 &&
              filterStore.selectedTagInfo.map((tag) => (
                <div
                  className="py-1 px-2 rounded-full border border-secondary flex gap-1 items-center"
                  key={tag.id}
                >
                  {tag.title}
                  <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={() => filterStore.removeTag(tag.id)}/>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
