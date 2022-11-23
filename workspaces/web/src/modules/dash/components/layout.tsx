import { DashNavBar } from "./navbar";
import { useMediaQuery } from "react-responsive";
import { DashSideMenu } from "./side-menu";
import { FindProject } from "./find-project";

export const DashLayout = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 1000px)",
  });

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <DashNavBar isMobile={isMobile}/>
      </div>
      <div className="w-full flex flex-auto p-3 gap-2">
        <div className="w-1/6 h-full">
          <DashSideMenu />
        </div>
        <div className="flex-auto h-full">
          <FindProject />
        </div>
        <div className="w-1/4 h-full bg-red-300"></div>
      </div>
    </div>
  );
};
