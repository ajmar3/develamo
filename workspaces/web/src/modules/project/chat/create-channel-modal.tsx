import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useProjectBaseStore } from "modules/project/stores/project-base.store";
import { useProjectSocketStore } from "modules/project/stores/project-socket.store";
import { useEffect, useState } from "react";

export const CreateChannelModal: React.FC = () => {
  const [nameInput, setNameInput] = useState("");
  const [nameInputError, setNameInputError] = useState(false);
  const channelNames = useProjectBaseStore((state) =>
    state.projectInfo?.chat.channels.map((x) => x.name)
  );
  const projectId = useProjectAuthStore(state => state.projectInfo?.id)
  const createChannel = useProjectSocketStore(state => state.createChannel);

  const handleClick = () => {
    setNameInputError(false);
    if (
      channelNames &&
      channelNames.some((x) => x.toLowerCase() == nameInput.toLowerCase())
    ) {
      setNameInputError(true);
      return;
    }
    if (!nameInput) return;
    createChannel({ projectId: projectId as string, name: nameInput });
    setNameInput("");
  };

  useEffect(() => {
    setNameInputError(false);
    if (
      channelNames &&
      channelNames.some((x) => x.toLowerCase() == nameInput.toLowerCase())
    ) {
      setNameInputError(true);
      return;
    }
  }, [, nameInput]);

  return (
    <>
      <input
        type="checkbox"
        id="create-channel-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg">Create Channel</h3>
          <input
            className={
              nameInputError
                ? "input input-bordered input-error my-3 w-3/4"
                : "input input-bordered input-secondary my-3 w-3/4"
            }
            placeholder="New channel name..."
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
          />
          <div className="w-full py-3 flex justify-between">
            <label htmlFor="create-channel-modal" className="btn btn-outline">
              Cancel
            </label>
            <label
              htmlFor="create-channel-modal"
              className={
                nameInput && !nameInputError
                  ? "btn btn-primary"
                  : "btn btn-outline"
              }
              onClick={handleClick}
            >
              Create
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
