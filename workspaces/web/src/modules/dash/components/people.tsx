import { DashConnections } from "./connections";

export const DashPeople: React.FC = () => {

  return (
    <div className="w-full p-4 flex flex-col gap-3">
      <div className="text-lg">People</div>
      <DashConnections />
    </div>
  );
};
