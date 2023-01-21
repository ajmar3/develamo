import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAcceptConnectionMutation } from "../hooks/useAcceptConnectionMutation";
import { useConnectionStore } from "../stores/connections.store";

export const DashConnections: React.FC = () => {

  const connections = useConnectionStore(state => state.connections);

  return (
    <div className="w-full bg-base-200 rounded-box">
      <div className="w-full flex flex-col">
        {connections.length > 0 ? (
          <div>
            <div className="mb-3 text-base-content text-opacity-70">
              Online
            </div>
            <div className="flex flex-col mt-3">
              {connections.map((connection) => (
                <div
                  className="w-full flex px-1 py-1 items-center justify-between hover:bg-base-100"
                  key={connection.id}
                >
                  <div className="flex gap-5 items-center">
                    <Image
                      src={connection.developer.avatarURL}
                      alt="profile picture"
                      width={45}
                      height={45}
                      className="rounded-full p-1 border border-base-content"
                    />
                    <div>
                      {connection.developer.name
                        ? connection.developer.name
                        : connection.developer.githubUsername}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-3">No Connections</div>
        )}
      </div>
    </div>
  );
};
