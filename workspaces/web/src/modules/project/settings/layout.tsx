import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useEffect, useState } from "react";
import { ProjectSettingsAdminLayout } from "./admin-layout";
import Image from "next/image";
import { useProjectSocketStore } from "../stores/project-socket.store";
import { useRouter } from "next/router";

export const ProjectSettingsLayout: React.FC = () => {
  const githubUsername = useProjectAuthStore(
    (state) => state.devInfo?.githubUsername
  );
  const developerId = useProjectAuthStore((state) => state.devInfo?.id);
  const projectInfo = useProjectBaseStore((state) => state.projectInfo);
  const leaveProject = useProjectSocketStore((state) => state.leaveProject);
  const projectDeletedIndicator = useProjectBaseStore(
    (state) => state.deleteProjectIndicator
  );
  const removedFromProjectIndicator = useProjectBaseStore(
    (state) => state.removedFromProjectIndicator
  );

  let leaveCount = 0;

  const router = useRouter();

  useEffect(() => {
    if (projectDeletedIndicator) {
      router.push("/dash/find");
    }
  }, [projectDeletedIndicator]);

  useEffect(() => {
    if (removedFromProjectIndicator) {
      router.push("/dash/find");
    }
  }, [removedFromProjectIndicator]);

  const [repoOffset, setRepoOffset] = useState(
    `https://github.com/${githubUsername}/`.length
  );

  const handleLeave = () => {
    leaveCount = leaveCount + 1;
    if (leaveCount < 2) {
      alert(
        "Are you sure you want to leave the project? If yes, select leave again."
      );
      return;
    } else if (projectInfo) {
      leaveProject(projectInfo.id);
      router.push("/dash/find");
    }
  };

  if (projectInfo?.owner.id == developerId) {
    return <ProjectSettingsAdminLayout />;
  }

  return (
    <div className="w-full h-full flex gap-2 p-2">
      <div className="w-2/3 flex flex-col gap-6">
        <div className="text-2xl text-white font-semibold">
          {projectInfo?.title}
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
        <div>
          <div className="text-xl text-white pb-2">Project Description</div>
          {projectInfo?.description}
        </div>
        <div>
          <button className="btn btn-warning" onClick={() => handleLeave()}>
            Leave Project
          </button>
        </div>
      </div>
    </div>
  );
};
