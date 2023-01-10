import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useEffect } from "react";
import { useGetProjectFeedMutation } from "../hooks/useGetProjectFeedMutation";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashProjectCard } from "./project-card";
import { ProjectDetailsModal } from "./project-details-modal";

export const DashFeed: React.FC = () => {
  const dashNavStore = useDashNavStore();

  const feedResults = useGetProjectFeedMutation();

  useEffect(() => {
    feedResults.mutate({ offset: 0 });
  }, []);

  if (feedResults.isLoading || !feedResults.data) return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="w-full flex justify-center">
        <div className="tabs">
          <a
            className="tab tab-bordered tab-active"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.FIND)}
          >
            Find A Project
          </a>
          <a
            className="tab tab-bordered"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.MY_PROJECTS)}
          >
            My Projects
          </a>
        </div>
      </div>
      <div className="w-full flex flex-col h-full flex-1 justify-center items-center mt-32">
        <LoadingSpinner size="medium" />
      </div>
    </div>
  );

  console.log(feedResults.data);

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="w-full flex justify-center">
        <div className="tabs">
          <a
            className="tab tab-bordered tab-active"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.FIND)}
          >
            Find A Project
          </a>
          <a
            className="tab tab-bordered"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.MY_PROJECTS)}
          >
            My Projects
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3">
        {feedResults.data.map(project => (
          <DashProjectCard {...project} key={project.id}/>
        ))}
      </div>
      <ProjectDetailsModal />
    </div>
  );
};
