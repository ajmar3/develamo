import { useMediaQuery } from "react-responsive";
import { DashMyProfile } from "./my-profile";
import { DashPeople } from "./people";
import { DashMain } from "./main";

export const DashLayout = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 1000px)",
  });

  return (
    <div className="w-screen h-screen flex justify-center bg-base-300">
      <div className="max-w-8xl w-full flex p-3 gap-4">
        <div className="w-1/5 h-full relative overflow-y-scroll bg-base-200 shadow-lg">
          <DashPeople />
        </div>
        <div className="w-1/2 h-full bg-base-200 shadow-lg overflow-y-scroll relative">
          <DashMain />
        </div>
        <div className="w-3/10 h-fit bg-base-200 shadow-lg">
          <DashMyProfile />
        </div>
      </div>
    </div>
  );
};
