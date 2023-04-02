import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useEffect } from "react";
import { useGetProjectFeedMutation } from "../../hooks/useGetProjectFeedMutation";
import { DashTabEnum, useDashNavStore } from "../../stores/nav-store";
import { DashProjectCard } from "./project-card";
import { ProjectDetailsModal } from "./project-details-modal";
import { useSearchStore } from "modules/dash/stores/search.store";

export const DashFeed: React.FC = () => {
  const dashNavStore = useDashNavStore();
  const feedResults = useSearchStore(state => state.feedResults)
  const setFeedResults = useSearchStore(state => state.setFeedResults)

  const feedMutation = useGetProjectFeedMutation();

  useEffect(() => {
    feedMutation.mutate({ offset: 0 });
  }, []);

  useEffect(() => {
    if (feedMutation.data) {
      setFeedResults(feedMutation.data);
    }
  }, [feedMutation.data, feedMutation.isSuccess]);

  if (feedMutation.isLoading || !feedMutation.data) return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="w-full flex flex-col h-full flex-1 justify-center items-center mt-10">
        <LoadingSpinner size="small" />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="flex flex-col gap-2">
        {feedResults.map(project => (
          <DashProjectCard {...project} key={project.id}/>
        ))}
      </div>
      <ProjectDetailsModal />
    </div>
  );
};
