import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useFeedbackStore } from "modules/common/stores/feedback.store";
import { ProjectApplicationType } from "modules/dash/hooks/useGetMyProjectsQuery";
import { useConnectionStore } from "modules/dash/stores/connections.store";
import { useProjectStrore } from "modules/dash/stores/project.store";
import { io, Socket } from "socket.io-client";
import create from "zustand";

export interface IConnectionSocketStore {
  socket: Socket;
  sendConRequest: (requestedId: string) => void;
  acceptConRequest: (requestId: string) => void;
  rejectConRequest: (requestId: string) => void;
  initSocket: (developerId: string) => void
}

export const useConnectionSocketStore = create<IConnectionSocketStore>((set) => {
  const connectStore = useConnectionStore.getState();
  const projectStore = useProjectStrore.getState();
  const feedbackStore = useFeedbackStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_CONNECTION_WEBSOCKET_URL as string, {
    withCredentials: true,
  });

  socket.on("new-connection-request", (data) => {
    connectStore.setConnectionRequests([...connectStore.connectionRequests, data]);
  });
  
  socket.on("connection-update", (data) => {
    connectStore.setConnections(data.connections);
    connectStore.setConnectionRequests(data.requests);
    connectStore.setSentRequests(data.sentRequests);
  });

  socket.on("new-sent-request", (data) => {
    connectStore.addSentRequest(data);
  });

  socket.on("connection-request-response", (data) => {
    connectStore.setConnections(data.connections);
    connectStore.setConnectionRequests(data.requests);
  });

  socket.on("error", (error) => {
    feedbackStore.addMessage(error);
  });

  return {
    socket: socket,
    sendConRequest: (requestedId: string) => {
      socket.emit("request-connection", {
        requestedId: requestedId
      });
    },
    acceptConRequest: (requestId: string) => {
      socket.emit("accept-request", {
        requestId: requestId
      });
    },
    rejectConRequest: (requestId: string) => {
      socket.emit("reject-request", {
        requestId: requestId
      });
    },
    initSocket: (developerId: any) => {
      socket.emit("connected", {
        developerId: developerId
      });
    }
  };
});
