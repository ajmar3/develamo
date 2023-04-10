import { DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { useKanbanSocketStore } from "modules/project/stores/kanban-socket.store";
import { TicketListType } from "modules/project/types/kanban.types";
import { useState } from "react";
import { KanbanTicket } from "./ticket";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip } from "@fortawesome/free-solid-svg-icons";

export const KanbanTicketList: React.FC<TicketListType> = (props) => {
  const [newTicketInput, setNewTicketInput] = useState("");
  const [newTicketInputOpen, setNewTicketInputOpen] = useState(false);
  const [ticketListNameInput, setTicketListNameInput] = useState(props.title);
  const [ticketListNameInputOpen, setTicketListNameInputOpen] = useState(false);

  const createTicket = useKanbanSocketStore((state) => state.createTicket);
  const projectId = useProjectAuthStore((state) => state.projectInfo?.id);

  const editTicket = useKanbanSocketStore(state => state.editTicketList);

  const addTicket = () => {
    if (newTicketInput && projectId) {
      createTicket({
        projectId: projectId,
        title: newTicketInput,
        ticketListId: props.id,
      });
      setNewTicketInput("");
      setNewTicketInputOpen(false);
    }
  };

  const submitEdit = () => {
    setTicketListNameInputOpen(false);
    if (ticketListNameInput.length < 1) return;
    if (ticketListNameInput == props.title) return;
    editTicket({
      ticketListId: props.id,
      newTitle: ticketListNameInput
    });
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    setActivatorNodeRef,
    transition,
  } = useSortable({
    id: props.id,
    data: { ...props },
  });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

  return (
    <SortableContext items={props.tickets}>
      <div
        className="w-full py-2 px-3 bg-base-200 rounded-md shadow-md flex flex-col gap-3 select-none cursor-default"
        ref={setNodeRef}
        {...attributes}
        style={style}
      >
        <div className="w-full flex justify-between items-center">
          {ticketListNameInputOpen ? (
            <>
              <input className="input h-8 w-4/5" value={ticketListNameInput} onChange={e => setTicketListNameInput(e.target.value)}/>
              <div className="flex items-center gap-1">
                <button
                  className="btn btn-square btn-xs"
                  onClick={() => setTicketListNameInputOpen(false)}
                >
                  <XMarkIcon />
                </button>
                <button className="btn btn-primary btn-square btn-xs disabled:btn-disabled" disabled={ticketListNameInput.length <= 0} onClick={() => submitEdit()}>
                  <CheckIcon />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-lg text-white font-semibold">
                {props.title}
              </div>
              <div className="flex items-center gap-4">
                <PencilSquareIcon
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setTicketListNameInputOpen(true)}
                />
                <div {...listeners} ref={setActivatorNodeRef} className="flex">
                  <FontAwesomeIcon icon={faGrip} />
                </div>
              </div>
            </>
          )}
        </div>
        {props.tickets.length > 0 ? (
          props.tickets.map((x) => <KanbanTicket {...x} key={x.id} />)
        ) : (
          <div className="w-full flex items-center justify-center">
            No tickets yet
          </div>
        )}
        {newTicketInputOpen ? (
          <div className="w-full bg-primary p-2 rounded-md h-fit">
            <input
              className="input w-full mb-2"
              placeholder="New ticket title..."
              onChange={(e) => setNewTicketInput(e.target.value)}
              value={newTicketInput}
            />
            <div className="flex justify-between w-full">
              <button
                className="btn"
                onClick={() => setNewTicketInputOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-primary-content text-primary border-none"
                onClick={() => addTicket()}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-primary w-full"
            onClick={() => setNewTicketInputOpen(true)}
          >
            Add new ticket
          </button>
        )}
      </div>
    </SortableContext>
  );
};
