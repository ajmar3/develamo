import { useEffect, useState } from "react";
import { useProjectBaseStore } from "../stores/project-base.store";
import Image from "next/image";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useProjectSocketStore } from "../stores/project-socket.store";

export const ManageChatModal: React.FC = () => {
  const channelInfo = useProjectBaseStore((state) => state.activeChannelInfo);
  const projectInfo = useProjectBaseStore((state) => state.projectInfo);
  const addDeveloper = useProjectSocketStore(
    (state) => state.addDeveloperToChannel
  );
  const removeDeveloper = useProjectSocketStore(
    (state) => state.removeDeveloperFromChannel
  );
  const editChannel = useProjectSocketStore((state) => state.editChannel);
  const deleteChannel = useProjectSocketStore((state) => state.deleteChannel);

  const [availableToBeAdded, setAvailableToBeAdded] = useState(
    projectInfo?.developers.filter(
      (x) => !channelInfo?.participants.map((y) => y.id).includes(x.id)
    )
  );

  useEffect(() => {
    setAvailableToBeAdded(
      projectInfo?.developers.filter(
        (x) => !channelInfo?.participants.map((y) => y.id).includes(x.id)
      )
    );
  }, [, channelInfo, projectInfo]);

  const [nameInput, setNameInput] = useState(
    channelInfo ? channelInfo.name : ""
  );

  const handleAdd = (developerId: string) => {
    if (channelInfo) {
      addDeveloper({ developerId: developerId, channelId: channelInfo.id });
    }
  };

  const handleRemove = (developerId: string) => {
    if (channelInfo) {
      removeDeveloper({ developerId: developerId, channelId: channelInfo.id });
    }
  };

  const handleDelete = () => {
    if (channelInfo) {
      deleteChannel(channelInfo.id);
    }
  };

  const handleEdit = () => {
    if (channelInfo && nameInput.length > 0 && nameInput != channelInfo.name) {
      editChannel({ name: nameInput, channelId: channelInfo.id });
    }
  };

  const handleResetEdit = () => {
    if (channelInfo) {
      setNameInput(channelInfo?.name);
    }
  };

  if (!channelInfo || !projectInfo || !availableToBeAdded) {
    return (
      <>
        <input
          type="checkbox"
          id="manage-chat-modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box max-w-4xl">
            <div className="w-full"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <input type="checkbox" id="manage-chat-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-4xl">
          <div className="w-full flex flex-col gap-2">
            <div className="text-sm">Channel Name:</div>
            <div className="w-full flex gap-2">
              <input
                className="input input-secondary w-72"
                onChange={(e) => setNameInput(e.target.value)}
                value={nameInput}
              />
              <button className="btn btn-secondary">
                <CheckIcon className="w-5 h-5" onClick={() => handleEdit()}/>
              </button>
              <button className="btn" onClick={() => handleResetEdit()}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mt-4">
            <div className="text-sm">Channel Members:</div>
            <div className="grid grid-cols-5 w-full gap-2">
              {channelInfo.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="w-full flex flex-col items-center gap-1 bg-base-200 rounded-md p-2 hover:shadow-md"
                >
                  <Image
                    src={participant.avatarURL}
                    width={50}
                    height={50}
                    className="rounded-full p-1 border"
                    alt={participant.name}
                  />
                  <div className="max-w-full overflow-hidden">
                    {participant.name
                      ? participant.name
                      : participant.githubUsername}
                  </div>
                  {channelInfo.admins
                    .map((x) => x.id)
                    .includes(participant.id) ? (
                    <div className="badge badge-accent badge-xs p-2 uppercase font-semibold">
                      Admin
                    </div>
                  ) : (
                    <button
                      className="btn btn-warning btn-xs"
                      onClick={() => handleRemove(participant.id)}
                    >
                      remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 w-full mt-4">
              {availableToBeAdded.map((nonParticipant) => (
                <div
                  key={nonParticipant.id}
                  className="w-full flex flex-col items-center gap-1 bg-base-200 rounded-md p-2 hover:shadow-md"
                >
                  <Image
                    src={nonParticipant.avatarURL}
                    width={50}
                    height={50}
                    className="rounded-full p-1 border"
                    alt={nonParticipant.name}
                  />
                  <div className="max-w-full overflow-hidden">
                    {nonParticipant.name
                      ? nonParticipant.name
                      : nonParticipant.githubUsername}
                  </div>
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleAdd(nonParticipant.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-between">
            <div className="modal-action">
              <label
                htmlFor="manage-chat-modal"
                className="btn btn-warning"
                onClick={() => handleDelete()}
              >
                Delete Channel
              </label>
            </div>
            <div className="modal-action">
              <label
                htmlFor="manage-chat-modal"
                className="btn"
                onClick={() => () => handleResetEdit()}
              >
                Close
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
