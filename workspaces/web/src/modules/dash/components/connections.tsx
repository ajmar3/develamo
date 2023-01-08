import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAcceptConnectionMutation } from "../hooks/useAcceptConnectionMutation";
import { useGetConnections } from "../hooks/useGetConnectionsQuery";
import { useRejectConnectionMutation } from "../hooks/useRejectConnectionMutation";
import { useRequestConnectionMutation } from "../hooks/useRequestConnectionMutation";
import {
  SearchDeveloperResultsType,
  useSearchMutation,
} from "../hooks/useSearchMutation";

export const DashConnections: React.FC = () => {
  const connectionsQuery = useGetConnections(true);
  const acceptRequestMutation = useAcceptConnectionMutation();
  const rejectMutation = useRejectConnectionMutation();

  if (connectionsQuery.isLoading || !connectionsQuery.data)
    return (
      <div className="w-full py-10 bg-base-200 rounded-box flex justify-center">
        <LoadingSpinner size="small" />
      </div>
    );

  return (
    <div className="w-full p-4 bg-base-200 rounded-box">
      <div className="w-full flex flex-col">
        {connectionsQuery.data.requests.length > 0 && (
          <div>
            <div className="mb-3 text-base-content text-opacity-70">
              Requests
            </div>
            <div className="flex flex-col mt-3">
              {connectionsQuery.data.requests.map((request) => (
                <div
                  className="w-full flex px-3 py-1 items-center justify-between hover:bg-base-100"
                  key={request.id}
                >
                  <div className="flex gap-5 items-center">
                    <Image
                      src={request.requesterAvatarURL}
                      alt="profile picture"
                      width={45}
                      height={45}
                      className="rounded-full p-1 border border-base-content"
                    />
                    <div>
                      {request.requesterName
                        ? request.requesterName
                        : request.requesterGithubUsername}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-accent"
                      onClick={() =>
                        acceptRequestMutation.mutate({ requestId: request.id })
                      }
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        rejectMutation.mutate({ requestId: request.id })
                      }
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {connectionsQuery.data.connections.length > 0 ? (
          <div>
            <div className="mb-3 text-base-content text-opacity-70">
              My Connections
            </div>
            <div className="flex flex-col mt-3">
              {connectionsQuery.data.connections.map((connection) => (
                <div
                  className="w-full flex px-3 py-1 items-center justify-between hover:bg-base-100"
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
