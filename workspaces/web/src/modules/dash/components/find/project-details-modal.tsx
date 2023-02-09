import { useProjectDetailsStore } from "../../stores/project-details.store";
import Image from "next/image";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import Link from "next/link";
import { useProjectStrore } from "../../stores/project.store";
import { useConnectionSocketStore } from "modules/dash/stores/connection-socket.store";

export const ProjectDetailsModal: React.FC = () => {
  const info = useProjectDetailsStore((state) => state.projectInfo);
  const developerId = useDevAuthStore((state) => state.devInfo?.id);
  const projectApplications = useProjectStrore(
    (state) => state.myProjectApplications
  );
  const applyToJoinProject = useConnectionSocketStore(state => state.applyToJoinProject);

  if (!info)
    return (
      <>
        <input
          type="checkbox"
          id="project-details-modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Project Details</h3>
            <div className="w-full flex justify-between">
              <div className="modal-action">
                <label
                  htmlFor="project-details-modal"
                  className="btn btn-outline"
                >
                  Back
                </label>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  const getButton = () => {
    if (projectApplications.find((x) => x.projectId == info?.id))
      return (
        <div className="modal-action">
          <label className="btn btn-disabled">Applied</label>
        </div>
      );
    else if (
      info.developers.find((x) => x.id == developerId) ||
      info.owner.id == developerId
    )
      return (
        <Link href={"/project/" + info.id + "/chat"}>
          <div className="modal-action">
            <label htmlFor="project-details-modal" className="btn btn-primary">
              Go To Project
            </label>
          </div>
        </Link>
      );
    else
      return (
        <div className="modal-action" onClick={() => applyToJoinProject(info.id)}>
          <label htmlFor="project-details-modal" className="btn btn-primary">
            Apply to join
          </label>
        </div>
      );
  };

  return (
    <>
      <input
        type="checkbox"
        id="project-details-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-3xl max-h-140 overflow-y-scroll">
          <h3 className="font-bold text-lg">Project Details</h3>
          <div className="flex flex-col gap-3 mt-4">
            <div>
              <label className="text-sm">Title</label>
              <div className="text-lg text-white">{info.title}</div>
            </div>
            <div>
              <label className="text-sm">Description</label>
              <div className="text-white">{info.description}</div>
            </div>
            <div>
              <label className="text-sm">Tags</label>
              <div className="max-w-full overflow-x-hidden flex gap-2 mt-1">
                {info.tags.map((tag) => (
                  <div className="p-1 bg-base-300" key={tag.id}>
                    {tag.title}
                  </div>
                ))}
              </div>
            </div>
            {info.repoURL && (
              <div>
                <label className="text-sm">Repo Url</label>
                <div className="text-white text-opacity-80">
                  <a href={info.repoURL}>{info.repoURL}</a>
                </div>
              </div>
            )}
            <div className="w-full flex justify-between items-center mt-3">
              <div>
                <label className="text-sm">Owner</label>
                <div className="text-white mt-1">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={info.owner.avatarURL}
                      width={50}
                      height={50}
                      className="rounded-full p-1 border"
                      alt="Owner profile picture"
                    />
                    <div>
                      {info.owner.name
                        ? info.owner.name
                        : info.owner.githubUsername}
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <label className="text-sm">Developers</label>
                <div className="text-white mt-1">
                  <div className="flex gap-1 items-center">
                    {info.developers.length > 0 ? (
                      info.developers.map((dev) => (
                        <Image
                          src={dev.avatarURL}
                          width={50}
                          height={50}
                          className="rounded-full p-1 border"
                          alt="Owner profile picture"
                          key={dev.id}
                        />
                      ))
                    ) : (
                      <div className="">No teammates yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div className="modal-action">
                <label
                  htmlFor="project-details-modal"
                  className="btn btn-outline"
                >
                  Back
                </label>
              </div>
              {getButton()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
