import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useProjectAuthStore } from "modules/auth/store/project-auth-store";
import { LoadingSpinner } from "modules/common/components/loading-spinner";
import { useKanbanSocketStore } from "modules/project/stores/kanban-socket.store";
import {
  IKanbanStore,
  useKanbanStore,
} from "modules/project/stores/kanban-store";
import { useEffect, useState } from "react";
import { KanbanTicket } from "./ticket";
import { KanbanTicketList } from "./ticket-list";
import { handleDragEndUtil, handleDragOverUtil } from "./utils";

export const ProjectKanbanLayout: React.FC = () => {
  const [newListInput, setNewListInput] = useState("");
  const [newListInputOpen, setNewListInputOpen] = useState(false);

  const [activeId, setActiveId] = useState<any>(null);
  const [activeInfo, setActiveInfo] = useState<any>(null);
  const [overInfo, setOverInfo] = useState<any>(null);

  const initKanbanSocket = useKanbanSocketStore((state) => state.initSocket);
  const socketAddNewList = useKanbanSocketStore(
    (state) => state.createTicketList
  );
  const reorderTicketFunc = useKanbanSocketStore(
    (state) => state.reorderTicket
  );
  const reorderTicketListFunc = useKanbanSocketStore(
    (state) => state.reorderTicketList
  );



  const socketConnected = useKanbanStore((state) => state.connected);

  const developerId = useProjectAuthStore((state) => state.devInfo?.id);
  const projectId = useProjectAuthStore((state) => state.projectInfo?.id);

  const localTicketLists = useKanbanStore(
    (state) => state.localUpdatedTicketLists
  );

  const kanbanStore = useKanbanStore();

  const addNewList = () => {
    if (newListInput && projectId) {
      socketAddNewList({ projectId: projectId, title: newListInput });
    }
    setNewListInputOpen(false);
    setNewListInput("");
  };

  useEffect(() => {
  }, [localTicketLists]);

  useEffect(() => {
    if (developerId && projectId) {
      initKanbanSocket({ developerId: developerId, projectId: projectId });
    }
  }, [, developerId, projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    kanbanStore.setActiveId(event.active.id);
    setActiveInfo(event.active.data.current);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverInfo(event.over?.data);
    handleDragOverUtil(event, kanbanStore as any as IKanbanStore, activeId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    handleDragEndUtil(
      event,
      kanbanStore as any as IKanbanStore,
      reorderTicketFunc,
      reorderTicketListFunc,
      projectId
    );
  };

  if (!socketConnected) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={localTicketLists}
        strategy={horizontalListSortingStrategy}
      >
        <div className="w-full h-full overflow-x-scroll flex gap-2">
          {localTicketLists.map((x) => (
            <div className="w-80 min-w-80" key={x.id}>
              <KanbanTicketList {...x} />
            </div>
          ))}
          {newListInputOpen ? (
            <div className="w-80 min-w-80 bg-secondary p-2 rounded-md h-fit">
              <input
                className="input w-full mb-2"
                placeholder="New list title..."
                onChange={(e) => setNewListInput(e.target.value)}
                value={newListInput}
              />
              <div className="flex justify-between w-full">
                <button
                  className="btn"
                  onClick={() => setNewListInputOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-secondary-content text-secondary border-none"
                  onClick={() => addNewList()}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-secondary w-80 min-w-80"
              onClick={() => setNewListInputOpen(true)}
            >
              Add new list
            </button>
          )}
        </div>
        {activeInfo && activeInfo.ticketListId && (
          <DragOverlay className="opacity-75">
            <KanbanTicket {...activeInfo} />
          </DragOverlay>
        )}
        {activeInfo && activeInfo.tickets && (
          <DragOverlay className="opacity-75">
            <KanbanTicketList {...activeInfo} />
          </DragOverlay>
        )}
      </SortableContext>
    </DndContext>
  );
};
