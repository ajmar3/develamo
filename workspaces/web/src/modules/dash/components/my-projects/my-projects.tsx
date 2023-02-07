import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { useGetMyProjectsQuery } from "../../hooks/useGetMyProjectsQuery";
import { DashTabEnum, useDashNavStore } from "../../stores/nav-store";

export const DashMyProjects: React.FC = () => {
  const myProjectsQuery = useGetMyProjectsQuery();

  if (myProjectsQuery.isLoading || !myProjectsQuery.data)
    return (
      <div className="w-full flex flex-col gap-3 h-full">
        <div className="w-full flex flex-col h-full flex-1 justify-center items-center mt-32">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-3 h-full overflow-y-scroll">
      <div className="w-full py-2 flex flex-col gap-6">
        <div className="w-full ">
          <div className="text-lg text-white mb-2">My Owned Projects</div>
          {myProjectsQuery.data.ownedProjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {myProjectsQuery.data.ownedProjects.map((project) => (
                <Link
                  href={"/project/"+project.id+"/chat"}
                  key={project.id}
                  className="bg-base-100 rounded-md w-full h-32 p-3 cursor-pointer hover:shadow-md flex flex-col justify-between"
                >
                  <div>{project.title}</div>
                  {project.developers.length > 0 ? (
                    <div className="flex gap-1 max-w-full overflow-x-hidden">
                      {project.developers.map((dev) => (
                        <Image
                          src={dev.avatarUrl}
                          width={40}
                          height={40}
                          alt={dev.githubUsername}
                          key={dev.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="ml-2 text-base-content text-opacity-70">
                      No teammates yet
                    </div>
                  )}

                  <div className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full text-center my-8">
              You do not own any projects
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="text-lg text-white mb-2">Projects I have joined</div>
          {myProjectsQuery.data.projects.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {myProjectsQuery.data.projects.map((project) => (
                <Link
                  href={"#"}
                  key={project.id}
                  className="bg-base-100 rounded-md w-full h-32 p-3 cursor-pointer hover:shadow-md flex flex-col justify-between"
                >
                  <div>{project.title}</div>
                  {project.developers.length > 0 ? (
                    <div className="flex gap-1 max-w-full overflow-x-hidden">
                      {project.developers.map((dev) => (
                        <Image
                          src={dev.avatarUrl}
                          width={40}
                          height={40}
                          alt={dev.githubUsername}
                          key={dev.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="ml-2 text-base-content text-opacity-70">
                      No teammates yet
                    </div>
                  )}

                  <div className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full text-center my-8">
              You have not joined any projects yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
