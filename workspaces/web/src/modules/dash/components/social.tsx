import { useState } from "react";
import { useDashNavStore } from "../stores/nav-store";

export const DashSocial = () => {

  const [resultsTab, setResultsTab] = useState<number>(1);
  
  if (resultsTab == 1)
  return (
    <div className="w-full flex flex-col gap-3 h-full p-2">
      <div className="w-full flex justify-center mb-2">
        <div className="tabs">
          <a
            className="tab tab-bordered tab-active"
            onClick={() => setResultsTab(1)}
          >
            Notifications
          </a>
          <a className="tab tab-bordered" onClick={() => setResultsTab(2)}>
            Dms
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3 h-full p-2">
      <div className="w-full flex justify-center mb-2">
        <div className="tabs">
          <a
            className="tab tab-bordered"
            onClick={() => setResultsTab(1)}
          >
            Notifications
          </a>
          <a className="tab tab-bordered tab-active" onClick={() => setResultsTab(2)}>
            Dms
          </a>
        </div>
      </div>
    </div>
  );
};
