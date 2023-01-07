import { NavBar } from "../../common/components/navbar";
import { useMediaQuery } from "react-responsive";
import { DashSideMenu } from "./side-menu";
import { FindProject } from "./find-project";
import { DashProfileTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashMyProfile } from "./my-profile";
import { DashConnections } from "./connections";
import { DashPeople } from "./people";

export const DashLayout = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 1000px)",
  });

  const navStore = useDashNavStore((state) => ({
    selectedProfileTab: state.selectedProfileTab,
    setSelectedProfileTab: state.setSelectedProfileTab
  }));

  return (
    <div className="w-screen h-screen flex justify-center bg-base-300">
      <div className="max-w-8xl w-full flex p-3 gap-4">
        <div className="w-1/5 h-full relative overflow-y-scroll bg-base-200 shadow-lg">
          <DashPeople />
        </div>
        <div className="w-1/2 h-full bg-base-200 shadow-lg"></div>
        <div className="w-3/10 h-fit bg-base-200 shadow-lg">
          <DashMyProfile />
        </div>
      </div>
    </div>
  );
};

      {/* <div className="w-full">
        <NavBar isMobile={isMobile} />
      </div>
      <div className="w-full flex flex-auto p-3 gap-2">
        <div className="w-1/6 h-full">
          <DashSideMenu />
        </div>
        <div className="flex-auto h-full">
          <FindProject />
        </div>
        <div className="w-1/4 h-full flex flex-col items-center">
          <div className="tabs text-lg">
            <button
              className={
                navStore.selectedProfileTab == DashProfileTabEnum.CONNECTIONS
                  ? "tab tab-bordered tab-active"
                  : "tab tab-bordered"
              }
              onClick={() => navStore.setSelectedProfileTab(DashProfileTabEnum.CONNECTIONS)}
            >
              Social
            </button>
            <button
              className={
                navStore.selectedProfileTab == DashProfileTabEnum.MY_PROFILE
                  ? "tab tab-bordered tab-active"
                  : "tab tab-bordered"
              }
              onClick={() => navStore.setSelectedProfileTab(DashProfileTabEnum.MY_PROFILE)}
            >
              My Profile
            </button>
          </div>
          {navStore.selectedProfileTab == DashProfileTabEnum.CONNECTIONS ? (
            <div className="w-full mt-5">
              <DashConnections />
            </div>  
          ) : (
            <div className="w-full mt-5">
              <DashMyProfile />
            </div>
          )}
        </div>
      </div> */}