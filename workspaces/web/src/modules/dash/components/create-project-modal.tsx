import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { SearchBox } from "modules/common/components/search-box";
import { useEffect, useState } from "react";
import { useCreateProjectMutation } from "../hooks/useCreateProjectMutation";
import { useCreateProjectStore } from "../stores/create-project.store";
import { useGetAllTagsQuery } from "../hooks/useGetAllTagsQuery";
import { LoadingSpinner } from "modules/common/components/loading-spinner";

export const CreateProjectModal: React.FC = () => {
  const createMutation = useCreateProjectMutation();
  const allTags = useGetAllTagsQuery();

  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [repoInput, setRepoInput] = useState("");

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

  const githubUsername = useDevAuthStore(state => state.devInfo?.githubUsername);

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

  const submit = () => {
    if (descInput && titleInput && filterStore.selectedTagInfo.length > 0) {
      createMutation.mutate({
        tagIds: filterStore.selectedTagInfo.map((x) => x.id),
        title: titleInput,
        description: descInput,
        repoURL: `https://github.com/${githubUsername}/${repoInput}`,
      });
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="create-project-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">Create Project</h3>
          <div className="w-full mt-5">
            <div className="mb-1">Title</div>
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Your project title"
              className="input input-bordered w-full max-w-xs focus:input-secondary"
            />
          </div>
          <div className="w-full mt-5">
            <div className="mb-1">Technology Tags</div>
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
          <div className="w-full mt-5">
            <div className="mb-1">Repo URL</div>
            <div className="flex w-full h-full">
              <div className="h-12 bg-base-300 flex items-center justify-center p-1 rounded-l-md pr-1 pl-2 font-semibold">https://github.com/{githubUsername}/</div>
              <input
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="project-name"
                className="input input-bordered w-full max-w-xs rounded-l-none pl-1"
              />
            </div>
          </div>
          <div className="w-full mt-5">
            <div className="mb-1">Description - {descInput.length}/1000</div>
            <textarea
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              maxLength={1000}
              placeholder="You project description"
              className="textarea textarea-bordered focus:textarea-secondary w-4/5 min-h-40"
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="modal-action">
              <label htmlFor="create-project-modal" className="btn btn-outline">
                Cancel
              </label>
            </div>
            <div className="modal-action">
              <label
                htmlFor="create-project-modal"
                className={
                  descInput &&
                  titleInput &&
                  filterStore.selectedTagInfo.length > 0
                    ? "btn btn-primary"
                    : "btn btn-disabled"
                }
                onClick={() => submit()}
              >
                Create
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
