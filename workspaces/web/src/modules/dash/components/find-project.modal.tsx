import { XMarkIcon } from "@heroicons/react/24/outline";
import { SearchBox } from "modules/common/components/search-box";
import { useEffect, useState } from "react";
import { useCreateProjectStore } from "../stores/create-project.store";
import { useGetAllTagsQuery } from "../hooks/useGetAllTagsQuery";
import { useCreateProjectSearchRequestMutation } from "../hooks/useCreateProjectSearchRequestMutatation";

export const FindProjectModal: React.FC = () => {
  const mutation = useCreateProjectSearchRequestMutation();
  const allTags = useGetAllTagsQuery();

  const [allTagsChecked, setAllTagsChecked] = useState(false);

  const filterStore = useCreateProjectStore((state) => ({
    availableTags: state.availableTags,
    selectedTagInfo: state.selectedTagInfo,
    setSelectedTagInfo: state.setSelectedTagInfo,
    setAvailableTags: state.setAvailableTags,
    tags: state.tags,
    addTag: state.addTag,
    removeTag: state.removeTag,
    allTags: state.allTags,
  }));

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
    filterStore.setAvailableTags(newAvailableList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStore.tags, filterStore.allTags]);

  const delayedReset = () => {
    setTimeout(() => {
      filterStore.setSelectedTagInfo([]);
      filterStore.setAvailableTags(filterStore.allTags);
    }, 50);
  };

  const handleSubmit = () => {
    if (filterStore.selectedTagInfo.length > 0) {
      mutation.mutate({ allTechnologies: allTagsChecked, tagIds: filterStore.selectedTagInfo.map(x => x.id) });
    }
    setTimeout(() => {
      filterStore.setSelectedTagInfo([]);
      filterStore.setAvailableTags(filterStore.allTags);
    }, 50);
  };

  return (
    <>
      <input type="checkbox" id="find-project-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-fit h-fit p-5 flex flex-col gap-5">
          <div className="text-lg font-semibold">Let Develamo Find You A Project</div>
          <div className="w-full min-w-96">
            <div className="mb-1">What technologies do you want to use?</div>
            <div className="mb-2">
              <SearchBox
                options={filterStore.availableTags}
                selectOptionFunc={(args: string) => filterStore.addTag(args)}
              />
            </div>
            <div className="flex gap-2">
              {filterStore.selectedTagInfo.length > 0 &&
                filterStore.selectedTagInfo.map((tag) => (
                  <div
                    className="py-1 px-2 rounded-full border border-secondary flex gap-1 items-center text-sm"
                    key={tag.id}
                  >
                    {tag.title}
                    <XMarkIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => filterStore.removeTag(tag.id)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="mb-3">
              Does the project have to use all these technologies, or just some?
            </div>
            <div className="flex gap-10 ">
              <div className="flex flex-col gap-2 items-center">
                <span className="label-text">Just some of them is fine!</span>
                <input
                  type="checkbox"
                  checked={!allTagsChecked}
                  onChange={(e) => setAllTagsChecked(!allTagsChecked)}
                  className="checkbox checkbox-secondary"
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <span className="label-text">I need to use all of them!</span>
                <input
                  type="checkbox"
                  checked={allTagsChecked}
                  onChange={(e) => setAllTagsChecked(!allTagsChecked)}
                  className="checkbox checkbox-secondary"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between">
              <label
                className="btn"
                htmlFor="find-project-modal"
                onClick={() => delayedReset()}
              >
                Close
              </label>
              <label
                className="btn btn-primary"
                htmlFor="find-project-modal"
                onClick={() => handleSubmit()}
              >
                Submit
              </label>
            </div>
        </div>
      </div>
    </>
  );
};
