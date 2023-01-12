import { DashMyProfile } from "./my-profile";
import { DashPeople } from "./people";
import { DashMain } from "./main";
import { useActionSocketStore } from "modules/sockets/actions.store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useEffect } from "react";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { DashNavBar } from "./nav-bar";
import { DashSocial } from "./social";

export const DashLayout = () => {
  const socket = useActionSocketStore();

  const developerId = useDevAuthStore(state => state.devInfo?.id)

  useEffect(() => {
    if (developerId) {
      socket.initSocket(developerId);
    }
  }, [, developerId]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-base-300  relative">
      <DashNavBar />
      <div className="max-w-8xl w-full flex p-3 gap-4 h-full overflow-y-scroll">
        <div className="w-1/6 h-full max-h-full bg-base-200 shadow-lg sticky top-0">
          <DashPeople />
        </div>
        <div className="w-1/2">
          <DashMain />
        </div>
        <div className="w-1/3 flex flex-col gap-3 sticky top-0">
          <div className="w-full bg-base-200 shadow-lg">
            <DashMyProfile />
          </div>
          <div className="w-full bg-base-200 shadow-lg">
            <DashSocial />
          </div>
        </div>
      </div>
    </div>
  );
};
