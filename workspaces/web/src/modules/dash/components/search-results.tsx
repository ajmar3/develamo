import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAcceptConnectionMutation } from "../hooks/useAcceptConnectionMutation";
import { useRejectConnectionMutation } from "../hooks/useRejectConnectionMutation";
import { useRequestConnectionMutation } from "../hooks/useRequestConnectionMutation";
import {
  SearchDeveloperResultsType,
  SearchResultsType,
  useSearchMutation,
} from "../hooks/useSearchMutation";
import { useConnectionStore } from "../stores/connections.store";

export const DashSearchResults: React.FC<{
  search: string;
}> = (props) => {
  const [searchResults, setSearchResults] = useState<SearchResultsType>({
    developers: [],
    projects: [],
  });

  const [resultsTab, setResultsTab] = useState<number>(1);

  const searchMutation = useSearchMutation();

  const connections = useConnectionStore((state) => state.connections);
  const requests = useConnectionStore((state) => state.connectionRequests);
  const sentRequests = useConnectionStore((state) => state.sentRequests);

  useEffect(() => {
    if (props.search) {
      searchMutation.mutate({ input: props.search });
    } else {
      setSearchResults({ developers: [], projects: [] });
    }
  }, [props.search]);

  useEffect(() => {
    if (searchMutation.data) {
      setSearchResults(searchMutation.data);
    } else if (searchMutation.isSuccess) {
      setSearchResults({ developers: [], projects: [] });
    }
  }, [searchMutation.isSuccess, connections, requests, sentRequests]);

  if (searchMutation.isLoading)
    return (
      <div className="w-full mt-20 flex justify-center items-center">
        <LoadingSpinner size="small" />
      </div>
    );

  if (resultsTab == 1)
    return (
      <div className="w-full flex flex-col gap-3 h-full">
        <div className="w-full flex justify-center">
          <div className="tabs">
            <a
              className="tab tab-bordered tab-active"
              onClick={() => setResultsTab(1)}
            >
              Projects
            </a>
            <a className="tab tab-bordered" onClick={() => setResultsTab(2)}>
              Developers
            </a>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-3 h-full z-10">
      <div className="w-full flex justify-center">
        <div className="tabs">
          <a className="tab tab-bordered" onClick={() => setResultsTab(1)}>
            Projects
          </a>
          <a
            className="tab tab-bordered tab-active"
            onClick={() => setResultsTab(2)}
          >
            Developers
          </a>
        </div>
      </div>
      {searchResults.developers.length > 0 ? (
        searchResults.developers.map((result) => (
          <div
            className="w-full flex py-2 px-3 items-center justify-between hover:bg-base-100"
            key={result.id}
          >
            <div className="ml-2 flex gap-3 items-center">
              <Image
                src={result.avatarURL}
                alt="profile picture"
                width={60}
                height={60}
                className="rounded-full p-1 border border-base-content"
              />
              <div>{result.name ? result.name : result.githubUsername}</div>
            </div>
            <PeopleActionButton developerId={result.id} />
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
    const request = requests.find((x) => x.requesterId == props.developerId);
    return (
      <div className="flex gap-2">
        <button
          className="btn btn-sm btn-outline btn-accent"
          onClick={() => acceptConMutation.mutate({ requestId: request.id })}
        >
          <CheckIcon className="w-4 h-4" />
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => rejectMutation.mutate({ requestId: request.id })}
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
