import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAcceptConnectionMutation } from "../hooks/useAcceptConnectionMutation";
import { useRejectConnectionMutation } from "../hooks/useRejectConnectionMutation";
import { useRequestConnectionMutation } from "../hooks/useRequestConnectionMutation";
import {
  SearchDeveloperResultsType,
  useSearchDevelopersMutation,
} from "../hooks/useSearchDevelopersMutation";
import { useConnectionStore } from "../stores/connections.store";

export const DashPeopleSearchResults: React.FC<{
  search: string;
}> = (props) => {
  const [searchResults, setSearchResults] =
    useState<SearchDeveloperResultsType>([]);

  const searchDevMutation = useSearchDevelopersMutation();

  const connections = useConnectionStore((state) => state.connections);
  const requests = useConnectionStore((state) => state.connectionRequests);
  const sentRequests = useConnectionStore((state) => state.sentRequests);
  const setSentRequests = useConnectionStore((state) => state.setSentRequests);

  useEffect(() => {
    if (props.search) {
      searchDevMutation.mutate({ input: props.search });
    } else {
      setSearchResults([]);
    }
  }, [props.search]);

  useEffect(() => {
    if (searchDevMutation.data) {
      setSearchResults(searchDevMutation.data);
    } else if (searchDevMutation.isSuccess) {
      setSearchResults([]);
    }
  }, [searchDevMutation.isSuccess, connections, requests, sentRequests]);

  if (searchDevMutation.isLoading)
    return (
      <div className="w-full mt-20 flex justify-center items-center">
        <LoadingSpinner size="small" />
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-3 h-full overflow-y-scroll">
      {searchResults.length > 0 ? (
        searchResults.map((result) => (
          <div
            className="w-full flex py-2 items-center hover:bg-base-100"
            key={result.id}
          >
            <Image
              src={result.avatarURL}
              alt="profile picture"
              width={45}
              height={45}
              className="rounded-full p-1 border border-base-content"
            />
            <div className="ml-2">
              <div>{result.name ? result.name : result.githubUsername}</div>
              <PeopleActionButton developerId={result.id} />
            </div>
          </div>
        ))
      ) : (
        <div className="mt-5 text-center">No results</div>
      )}
    </div>
  );
};

const PeopleActionButton: React.FC<{
  developerId: string;
}> = (props) => {
  const connections = useConnectionStore((state) => state.connections);
  const requests = useConnectionStore((state) => state.connectionRequests);
  const sentRequests = useConnectionStore((state) => state.sentRequests);
  const conRequestMutation = useRequestConnectionMutation();
  const acceptConMutation = useAcceptConnectionMutation();
  const rejectMutation = useRejectConnectionMutation();

  const [loadingState, setLoadingState] = useState(false);

  if (connections.find((x) => x.developer.id == props.developerId))
    return <button className="btn btn-xs btn-primary">Chat</button>;
  else if (requests.find((x) => x.requesterId == props.developerId)) {
    const request = requests.find(x => x.requesterId == props.developerId);
    return (
      <div className="flex gap-2">
      <button
        className="btn btn-sm btn-outline btn-accent"
        onClick={() =>
          acceptConMutation.mutate({ requestId: request.id })
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
    );
  } else if (sentRequests.find((x) => x.requestedId == props.developerId))
    return (
      <button className="btn btn-xs btn-disabled" disabled={true}>
        Requested
      </button>
    );
  else if (loadingState) return <LoadingSpinner size="xs" />;
  else
    return (
      <button
        className="btn btn-xs btn-outline btn-secondary"
        onClick={() => {
          conRequestMutation.mutate({ requestedId: props.developerId });
          setLoadingState(true);
        }}
      >
        Connect
      </button>
    );
};
