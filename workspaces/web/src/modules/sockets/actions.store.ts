import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useConnectionStore } from "modules/dash/stores/connections.store";
import { io, Socket } from "socket.io-client";
import create from "zustand";

export interface IActionSocketStore {
  socket: Socket;
  sendConRequest: (requestedId: string) => void;
  acceptConRequest: (requestId: string) => void;
  rejectConRequest: (requestId: string) => void;
  initSocket: (developerId: string) => void
}

export const useActionSocketStore = create<IActionSocketStore>((set) => {
  const connectStore = useConnectionStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_ACTIONS_WEBSOCKET_URL as string, {
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
