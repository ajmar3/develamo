import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useKanbanStore } from "../stores/kanban-store";
import { useEffect, useState } from "react";
import { useKanbanSocketStore } from "../stores/kanban-socket.store";

export const TicketDetailsModal = () => {
  const openTicketInfo = useKanbanStore((state) => state.openTicketInfo);
  const setOpenTicketInfo = useKanbanStore((state) => state.setOpenTicketInfo);

  const deleteTicket = useKanbanSocketStore((state) => state.deleteTicket);
  const editTicket = useKanbanSocketStore((state) => state.editTicket);

  const [titleInput, setTitleInput] = useState(
    openTicketInfo ? openTicketInfo.title : ""
  );
  const [descInputInput, setDescInput] = useState(
    openTicketInfo ? openTicketInfo.description : ""
  );

  const delayedReset = () => {
    setTimeout(() => {
      setOpenTicketInfo(undefined);
    }, 50);
  };

  const handleDelete = () => {
    if (openTicketInfo) {
      deleteTicket({
        ticketId: openTicketInfo.id,
        ticketListId: openTicketInfo.ticketListId,
      });
      delayedReset();
    }
  };

  const handleEdit = () => {
    if (openTicketInfo) {
      editTicket({
        ticketId: openTicketInfo.id,
        newTitle: titleInput,
        newDescription: descInputInput,
      });
      delayedReset();
    }
  };

  useEffect(() => {
    setDescInput(openTicketInfo ? openTicketInfo.description : "");
    setTitleInput(openTicketInfo ? openTicketInfo.title : "");
  }, [openTicketInfo]);

  if (!openTicketInfo)
    return (
      <>
        <input
          type="checkbox"
          id="ticket-details-modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box max-w-lg h-96 flex flex-col items-center overflow-hidden">
            <div className="h-5/6 flex items-center">
              <LoadingSpinner size="medium" />
            </div>
            <label
              className="btn"
              htmlFor="ticket-details-modal"
              onClick={() => delayedReset()}
            >
              Close
            </label>
          </div>
        </div>
      </>
    );

  return (
    <>
      <input
        type="checkbox"
        id="ticket-details-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box flex flex-col gap-5 p-5">
          <div>
            <div className="text-sm mb-3">Ticket Title</div>
            <input
              className="input input-bordered"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </div>
          <div>
            <div className="text-sm mb-3">Ticket Description</div>
            <textarea
              className="textarea textarea-bordered w-96 h-24"
              value={descInputInput}
              onChange={(e) => setDescInput(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="">
              <label
                className="btn btn-warning"
                htmlFor="ticket-details-modal"
                onClick={() => handleDelete()}
              >
                Delete Ticket
              </label>
            </div>
            <div className="flex gap-2">
              <label
                className="btn"
                htmlFor="ticket-details-modal"
                onClick={() => delayedReset()}
              >
                Close
              </label>
              <label
                className="btn btn-primary"
                htmlFor="ticket-details-modal"
                onClick={() => handleEdit()}
              >
                Save Changes
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
