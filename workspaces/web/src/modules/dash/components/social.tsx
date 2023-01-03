import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useGetConnections } from "../hooks/useGetConnectionsQuery";

export const DashSocial: React.FC = () => {
  
  const connectionsQuery = useGetConnections();

  if (connectionsQuery.isLoading) return (
    <div className="w-full py-10 bg-base-300 rounded-box flex justify-center">
      <LoadingSpinner size="small" />
    </div>
  );

  return (
    <div className="w-full p-4 bg-base-300 rounded-box">
      <div className="w-full flex flex-col">
        <div className="mb-3 text-lg text-base-content text-opacity-70">Connections</div>
        <div className="flex flex-col gap-3"></div>
      </div>
    </div>
  );
};
