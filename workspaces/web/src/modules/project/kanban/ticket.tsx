import { TicketType } from "modules/project/types/kanban.types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip } from "@fortawesome/free-solid-svg-icons";

export const KanbanTicket: React.FC<TicketType | any> = (props) => {
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
    <div
      className="w-full p-2 bg-base-100 shadow-md rounded-md cursor-pointer select-none"
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      <div className="w-full flex justify-between">
        {props.title}
        <div {...listeners} ref={setActivatorNodeRef}>
          <FontAwesomeIcon icon={faGrip} />
        </div>
      </div>
    </div>
  );
};
