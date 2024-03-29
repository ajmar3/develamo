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
import { useChatMessageStore } from "../stores/chat-message.store";
import { DashProjectCard } from "./find/project-card";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { useConnectionSocketStore } from "../stores/connection-socket.store";
import { useChatSocketStore } from "../stores/chat-socket.store";
import { useSearchStore } from "../stores/search.store";

export const DashSearchResults: React.FC<{
  search: string;
}> = (props) => {

  const searchResults = useSearchStore(state => state.searchResults);
  const setSearchResults = useSearchStore(state => state.setSearchResults);

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
      <div className="w-full mt-10 flex justify-center items-center">
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
        {searchResults.projects.length > 0 ? (
          <div className="flex flex-col gap-2 px-3">
            {searchResults.projects.map((project) => (
              <DashProjectCard {...project} key={project.id} />
            ))}
          </div>
        ) : (
          <div className="w-full text-center mt-10">No search results</div>
        )}
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
        <div className="mt-10 text-center">No search results</div>
      )}
    </div>
  );
};

const PeopleActionButton: React.FC<{
  developerId: string;
}> = (props) => {
  const developerId = useDevAuthStore((state) => state.devInfo?.id as string);
  const connections = useConnectionStore((state) => state.connections);
  const requests = useConnectionStore((state) => state.connectionRequests);
  const sentRequests = useConnectionStore((state) => state.sentRequests);
  const makeConRequest = useConnectionSocketStore((state) => state.sendConRequest);
  const acceptConRequest = useConnectionSocketStore(
    (state) => state.acceptConRequest
  );
  const rejectConRequest = useConnectionSocketStore(
    (state) => state.rejectConRequest
  );
  const chats = useChatMessageStore((state) => state.chats);
  const setDashNavTab = useDashNavStore((state) => state.setActiveTab);

  useEffect(() => {
    const chat = chats.directMessageChats.find((x) =>
      x.participants.map((x) => x.id).includes(props.developerId)
    );
  }, [chats]);

  if (connections.find((x) => x.developerId == props.developerId))
    return (
      <div className="btn btn-xs btn-primary cursor-default">
        Connected
      </div>
    );
  else if (requests.find((x) => x.requesterId == props.developerId)) {
    const request = requests.find((x) => x.requesterId == props.developerId);
    return (
      <div className="flex gap-2">
        <button
          className="btn btn-sm btn-outline btn-accent"
          onClick={() => {
            acceptConRequest(request.id);
          }}
        >
          <CheckIcon className="w-4 h-4" />
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => {
            rejectConRequest(request.id);
          }}
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
  else
    return (
      <button
        className="btn btn-xs btn-outline btn-secondary"
        onClick={() => {
          makeConRequest(props.developerId);
        }}
      >
        Connect
      </button>
    );
};
