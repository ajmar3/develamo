import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { IKanbanStore } from "../stores/kanban-store";
import { TicketListType, TicketType } from "../types/kanban.types";

export const handleDragOverUtil = (
  event: DragOverEvent,
  kanbanStore: IKanbanStore,
  activeId: string
) => {
  if (!event.over || event.over.id == activeId) return;
  const listIds = kanbanStore.localUpdatedTicketLists.map(x => x.id);
  if (listIds.includes(activeId)) {
    handleDragOverTicketList(
      event,
      kanbanStore,
      activeId
    );
    return;
  }

  const activeData = event.active.data.current;
  const overData = event.over.data.current;

  if (!activeData || !overData) return;
  
  const startListId = activeData.ticketListId;
  const endListId = overData.ticketListId;

  let overEmptyList = false;
  if(listIds.includes(overData.id) && overData.tickets?.length == 0) overEmptyList = true;
  if (overEmptyList) {
    handleDragOverEmptyList(
      event,
      kanbanStore,
      activeId
    );
    return;
  }

  if (!startListId || !endListId) return;

  const startListIndex = kanbanStore.localUpdatedTicketLists.findIndex(x => x.id == startListId);
  const endListIndex = kanbanStore.localUpdatedTicketLists.findIndex(x => x.id == endListId);
  
  if (startListId == endListId) {
    const ticketsFromList = kanbanStore.localUpdatedTicketLists.find(x => x.id == startListId)?.tickets;

    let relevantTickets: TicketType[] = [];
    let updatedRelevantTickets: TicketType[] = [];

    if (overData.orderIndex > activeData.orderIndex) {
      relevantTickets = ticketsFromList?.filter(x => x.orderIndex > activeData.orderIndex && x.orderIndex <= overData.orderIndex) as TicketType[];

      updatedRelevantTickets = relevantTickets?.map(ticket => {
        ticket.orderIndex = ticket.orderIndex -1;
        return ticket;
      });
    } else {
      relevantTickets = ticketsFromList?.filter(x => x.orderIndex < activeData.orderIndex && x.orderIndex >= overData.orderIndex) as TicketType[];

      updatedRelevantTickets = relevantTickets?.map(ticket => {
        ticket.orderIndex = ticket.orderIndex +1;
        return ticket;
      });
    }
    
    const activeTicket = ticketsFromList?.find(x => x.id == activeId) as TicketType;
    activeTicket.orderIndex = overData.orderIndex;      
    updatedRelevantTickets?.push(activeTicket); 

    const updatedRelevantTicketsIds = updatedRelevantTickets?.map(x => x.id);
    const unaffectedicketsFromList = ticketsFromList?.filter(x => !updatedRelevantTicketsIds?.includes(x.id) && activeId != x.id) as TicketType[];
    const updatedTicketsForList = updatedRelevantTickets?.concat(unaffectedicketsFromList); 

    const currentStoreTickets = kanbanStore.localUpdatedTicketLists.map(x => x);      
    currentStoreTickets[startListIndex].tickets = updatedTicketsForList?.sort((a, b) => a.orderIndex - b.orderIndex) as TicketType[]; 
  }
  else {
    // SORT LIST TICKET STARTED IN
    const startList = kanbanStore.localUpdatedTicketLists.find(x => x.id == startListId) as TicketListType;
    const affectedStartListTickets = startList.tickets.filter(x => x.orderIndex > activeData.orderIndex);
    const updatedAffectedStartListTickets = affectedStartListTickets.map(ticket => {
      ticket.orderIndex = ticket.orderIndex -1;
      return ticket;
    });

    const affectedStartListTicketsIds = affectedStartListTickets.map(x => x.id);
    const unaffectedStartListTickets = startList.tickets.filter(x => !affectedStartListTicketsIds.includes(x.id));

    const newStartListTickets = unaffectedStartListTickets.concat(updatedAffectedStartListTickets);
    const indexOfActiveItem = newStartListTickets.findIndex(x => x.id == activeData.id);
    newStartListTickets.splice(indexOfActiveItem, 1);

    // SORT LIST TICKET ENDED IN
    const endList = kanbanStore.localUpdatedTicketLists.find(x => x.id == endListId) as TicketListType;
    const affectedEndListTickets = endList.tickets.filter(x => x.orderIndex >= overData.orderIndex);
    const updatedAffectedTickets = affectedEndListTickets.map(ticket => {
      ticket.orderIndex = ticket.orderIndex +1;
      return ticket;
    });

    const affectedEndListTicketsIds = affectedEndListTickets.map(x => x.id);
    const unaffectedEndListTickets = endList.tickets.filter(x => !affectedEndListTicketsIds.includes(x.id));

    const newEndListTickets = unaffectedEndListTickets.concat(updatedAffectedTickets);
    const ticketToAdd = activeData as TicketType;
    ticketToAdd.orderIndex = overData.orderIndex;
    ticketToAdd.ticketListId = overData.ticketListId;
    newEndListTickets.push(ticketToAdd);

    //update state
    const currentStoreTickets = kanbanStore.localUpdatedTicketLists.map(x => x);      
    currentStoreTickets[startListIndex].tickets = newStartListTickets.sort((a, b) => a.orderIndex - b.orderIndex) as TicketType[];
    currentStoreTickets[endListIndex].tickets = newEndListTickets.sort((a, b) => a.orderIndex - b.orderIndex) as TicketType[]; 
  }
};

const handleDragOverEmptyList = (
  event: DragOverEvent,
  kanbanStore: IKanbanStore,
  activeId: string
) => {

  const activeData = event.active.data.current;
  const overData = event.over?.data.current;

  if (!activeData || !overData) return;
  
  const startListId = activeData.ticketListId;
  const endListId = event.over?.id;

  const startListIndex = kanbanStore.localUpdatedTicketLists.findIndex(x => x.id == startListId);
  const endListIndex = kanbanStore.localUpdatedTicketLists.findIndex(x => x.id == endListId);

  // SORT LIST TICKET STARTED IN
  const startList = kanbanStore.localUpdatedTicketLists.find(x => x.id == startListId) as TicketListType;
  const affectedStartListTickets = startList.tickets.filter(x => x.orderIndex > activeData.orderIndex);
  const updatedAffectedStartListTickets = affectedStartListTickets.map(ticket => {
    ticket.orderIndex = ticket.orderIndex -1;
    return ticket;
  });

  const affectedStartListTicketsIds = affectedStartListTickets.map(x => x.id);
  const unaffectedStartListTickets = startList.tickets.filter(x => !affectedStartListTicketsIds.includes(x.id));

  const newStartListTickets = unaffectedStartListTickets.concat(updatedAffectedStartListTickets);
  const indexOfActiveItem = newStartListTickets.findIndex(x => x.id == activeData.id);
  newStartListTickets.splice(indexOfActiveItem, 1);

  // ADD TO NEW LIST
  const ticketToAdd = activeData as TicketType;
  ticketToAdd.orderIndex = 0;
  ticketToAdd.ticketListId = endListId as string;
  const ticketInsideList = [ticketToAdd];

  const currentStoreTickets = kanbanStore.localUpdatedTicketLists;     
  currentStoreTickets[startListIndex].tickets = newStartListTickets.sort((a, b) => a.orderIndex - b.orderIndex) as TicketType[];
  currentStoreTickets[endListIndex].tickets = ticketInsideList;
};

const handleDragOverTicketList = (
  event: DragOverEvent,
  kanbanStore: IKanbanStore,
  activeId: string
) => {
  if(!event.over || !event.over.id) return;
  let overTicketListId: string;
  if(kanbanStore.localUpdatedTicketLists.map(x => x.id).includes(event.over.id as string)) {
    overTicketListId = event.over.id as string;
  }
  else {
    overTicketListId = event.over.data.current?.ticketListId;
  }

  const overTicketList = kanbanStore.localUpdatedTicketLists.find(x => x.id == overTicketListId) as TicketListType;
  const activeTicketList = kanbanStore.localUpdatedTicketLists.find(x => x.id == activeId) as TicketListType;

  const activeOrderIndex = event.active.data.current?.orderIndex;
  const overOrderIndex = overTicketList.orderIndex;

  if (activeOrderIndex == overOrderIndex) return;

  const currentStoreTicketLists = kanbanStore.localUpdatedTicketLists;
  
  let affectedStoreTicketLists: TicketListType[];
  
  if (activeOrderIndex < overOrderIndex) {
    affectedStoreTicketLists = currentStoreTicketLists.filter(x => x.orderIndex > activeOrderIndex && x.orderIndex <= overOrderIndex);
    affectedStoreTicketLists = affectedStoreTicketLists.map(ticketList => {
      ticketList.orderIndex = ticketList.orderIndex -1;
      return ticketList;
    });
    activeTicketList.orderIndex = overOrderIndex;
    affectedStoreTicketLists.push(activeTicketList);
  }
  else {
    affectedStoreTicketLists = currentStoreTicketLists.filter(x => x.orderIndex < activeOrderIndex && x.orderIndex >= overOrderIndex);
    affectedStoreTicketLists = affectedStoreTicketLists.map(ticketList => {
      ticketList.orderIndex = ticketList.orderIndex +1;
      return ticketList;
    });
    activeTicketList.orderIndex = overOrderIndex;
    affectedStoreTicketLists.push(activeTicketList);
  }

  const affectedTicketListsIds = affectedStoreTicketLists.map(x => x.id);
  const unaffectedTicketLists = currentStoreTicketLists.filter(x => !affectedTicketListsIds.includes(x.id));

  const newStoreTicketLists = unaffectedTicketLists.concat(affectedStoreTicketLists);
  newStoreTicketLists.sort((a, b) => a.orderIndex - b.orderIndex);
  kanbanStore.localUpdatedTicketLists = newStoreTicketLists;
};

export const handleDragEndUtil = (
  event: DragEndEvent,
  kanbanStore: IKanbanStore,
  reorderTicketFunc: any,
  reorderTicketListFunc: any,
  projectId?: string
) => {
  kanbanStore.setActiveId(null);

  const activeElement = event.active.data.current;

  if (!activeElement) return;

  const activeTicketList = kanbanStore.ticketLists.find(x => x.id == activeElement.id);
  if (activeTicketList) {
    const oldInfo = kanbanStore.ticketLists.find(x => x.id == activeTicketList.id);
    const newInfo = kanbanStore.localUpdatedTicketLists.find(x => x.id == activeTicketList.id);

    reorderTicketListFunc({
      projectId: projectId,
      id: activeElement.id,
      newOrderIndex: newInfo?.orderIndex,
      oldOrderIndex: oldInfo?.orderIndex,
    });
  }
  else {
    const oldInfo = kanbanStore.ticketLists.find(x => x.tickets.map(x => x.id).includes(activeElement.id))?.tickets.find(x => x.id == activeElement.id);
    const newInfo = kanbanStore.localUpdatedTicketLists.find(x => x.id == activeElement.ticketListId)?.tickets.find(x => x.id == activeElement.id);

    reorderTicketFunc({
      projectId: projectId,
      id: activeElement.id,
      newTicketListId: newInfo?.ticketListId,
      oldTicketListId: oldInfo?.ticketListId,
      newOrderIndex: newInfo?.orderIndex,
      oldOrderIndex: oldInfo?.orderIndex,
    });
  }
};
