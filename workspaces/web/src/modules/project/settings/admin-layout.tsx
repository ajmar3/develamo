import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectAdminStore } from "modules/project/stores/project-admin.store";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useProjectSocketStore } from "modules/project/stores/project-socket.store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProjectSettingsAdminLayout: React.FC = () => {
  const githubUsername = useProjectAuthStore(
    (state) => state.devInfo?.githubUsername
  );

  const projectInfo = useProjectBaseStore((state) => state.projectInfo);
  const applications = useProjectAdminStore(
    (state) => state.projectApplications
  );
  const getApplications = useProjectSocketStore(
    (state) => state.getProjectApplication
  );
  const acceptApplication = useProjectSocketStore(
    (state) => state.acceptProjectApplication
  );
  const rejectApplication = useProjectSocketStore(
    (state) => state.rejectProjectApplication
  );
  const deleteProject = useProjectSocketStore((state) => state.deleteProject);
  const editProject = useProjectSocketStore((state) => state.editProject);
  const removeDev = useProjectSocketStore((state) => state.removeDeveloperFromProject);

  const [titleInput, setTitleInput] = useState(projectInfo?.title);
  const [descInput, setDescInput] = useState(projectInfo?.description);
  const [repoInput, setRepoInput] = useState(
    projectInfo?.repoURL.slice(`https://github.com/${githubUsername}/`.length)
  );

  useEffect(() => {
    if (projectInfo) {
      getApplications(projectInfo?.id);
    }
  }, []);

  let deleteCounter = 0;
  const handleDelete = () => {
    deleteCounter = deleteCounter + 1;
    if (deleteCounter < 2) {
      alert(
        "Are you sure you want to delete this project, it will remove the project for all team members? If yes, select delete again."
      );
      return;
    } else if (projectInfo) {
      deleteProject(projectInfo.id);
    }
  };

  const handleSave = () => {
    if (titleInput && descInput && repoInput && projectInfo) {
      editProject({ title: titleInput, description: descInput, repoURL: `https://github.com/${githubUsername}/` + repoInput }, projectInfo?.id);
    }
  };

  const removeCounter = { id: "", counter: 0 };
  const handleRemove = (id: string) => {
    if (removeCounter.id != id) {
      removeCounter.counter = 0;
    }
    removeCounter.counter = removeCounter.counter + 1;
    removeCounter.id = id;
    if (removeCounter.counter != 2) {
      alert(
        "Are you sure you want to remove this developer from the project? If yes, select remove again."
      );
      return;
    } else if (projectInfo) {
      removeDev({ projectId: projectInfo.id, developerId: id });
    }
  };

  return (
    <div className="w-full h-full flex gap-5 p-2">
      <div className="w-2/3 flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl text-white">Project Team</div>
          <div className="flex gap-2">
            {projectInfo && projectInfo?.developers.length > 0 ? (
              projectInfo?.developers.map((dev) => (
                <div key={dev.id} className="flex flex-col items-center gap-2">
                  <Image
                    src={dev.avatarURL}
                    alt="profile-picture"
                    width={60}
                    height={60}
                    className="rounded-full border p-1"
                  />
                  <button className="btn btn-warning btn-xs" onClick={() => handleRemove(dev.id)}>Remove</button>
                </div>
              ))
            ) : (
              <div className="text-center my-8">No teammates yet!</div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl text-white">Edit project info:</div>
          <div className="w-full flex gap-2">
            <div className="w-1/2">
              <div className="label">Title</div>
              <input
                className="input input-secondary w-full max-w-lg"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <div className="label">Repo URL</div>
              <div className="flex w-full h-full">
                <div className="h-12 bg-base-200 border-secondary border flex items-center justify-center p-1 rounded-l-md pr-1 pl-2 font-semibold">
                  https://github.com/{githubUsername}/
                </div>
                <input
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="project-name"
                  className="input input-bordered max-w-xs rounded-l-none pl-1"
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="label">Description</div>
            <textarea
              className="input input-secondary w-full h-36 py-2 px-3"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-2 justify-end">
            <button className="btn btn-warning" onClick={() => handleDelete()}>
              Delete Project
            </button>
            <button className="btn btn-primary" onClick={() => handleSave()}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-2">
        <div className="text-xl text-white">Applications</div>
        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              className="w-full bg-base-100 max-h-96 shadow-md rounded-sm p-3"
              key={app.id}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={app.requester.avatarURL}
                  alt="profile-picture"
                  width={70}
                  height={70}
                  className="rounded-full p-1 border"
                />
                <div>
                  <div className="text-white">
                    {app.requester.name && app.requester.name}
                  </div>
                  <Link
                    className="text-white text-opacity-70"
                    href={"https://github.com/" + app.requester.githubUsername}
                  >
                    @{app.requester.githubUsername}
                  </Link>
                </div>
              </div>
              <div className="text-sm max-h-48 overflow-hidden mt-3 pl-1">
                {app.requester.bio}
              </div>
              <div className="text-sm max-h-48 overflow-hidden mt-3 pl-1">
                Requested on:{" "}
                <span className="text-white text-opacity-100">
                  {new Date(app.createdAt).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="w-full flex justify-between mt-3">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => rejectApplication(app.id)}
                >
                  Reject
                </button>

                <div className="flex gap-5">
                  <button className="btn btn-sm btn-secondary">Chat</button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => acceptApplication(app.id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center">No new applications</div>
        )}
      </div>
    </div>
  );
};
