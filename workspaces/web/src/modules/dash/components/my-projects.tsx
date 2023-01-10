import { DashTabEnum, useDashNavStore } from "../stores/nav-store";

export const DashMyProjects: React.FC = () => {
  const dashNavStore = useDashNavStore();

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      <div className="w-full flex justify-center">
        <div className="tabs">
          <a
            className="tab tab-bordered"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.FIND)}
          >
            Find A Project
          </a>
          <a
            className="tab tab-bordered tab-active"
            onClick={() => dashNavStore.setActiveTab(DashTabEnum.MY_PROJECTS)}
          >
            My Projects
          </a>
        </div>
      </div>
    </div>
  );
};
