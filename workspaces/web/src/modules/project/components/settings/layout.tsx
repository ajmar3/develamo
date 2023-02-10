import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useState } from "react";
import { ProjectSettingsAdminLayout } from "./admin-layout";
import Image from "next/image";

export const ProjectSettingsLayout: React.FC = () => {
  const githubUsername = useProjectAuthStore(
    (state) => state.devInfo?.githubUsername
  );
  const developerId = useProjectAuthStore((state) => state.devInfo?.id);

  const projectInfo = useProjectBaseStore((state) => state.projectInfo);
  const [titleInput, setTitleInput] = useState(projectInfo?.title);
  const [descInput, setDescInput] = useState(projectInfo?.description);
  const [repoInput, setRepoInput] = useState(
    projectInfo?.repoURL.slice(`https://github.com/${githubUsername}/`.length)
  );

  const [repoOffset, setRepoOffset] = useState(
    `https://github.com/${githubUsername}/`.length
  );

  if (projectInfo?.owner.id == developerId) {
    return <ProjectSettingsAdminLayout />;
  }

  return (
    <div className="w-full h-full flex gap-2 p-2">
      <div className="w-2/3 flex flex-col gap-8">
        <div>
          <button className="btn btn-warning">Leave Project</button>
        </div>
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
                </div>
              ))
            ) : (
              <div className="text-center my-8">No teammates yet!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
