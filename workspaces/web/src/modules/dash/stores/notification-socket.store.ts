import { io, Socket } from "socket.io-client";
import create from "zustand";
import { useFeedbackStore } from "modules/common/stores/feedback.store";
import { useNotificationStore } from "./notifications.store";

export interface INotificationSocketStore {
  socket: Socket;
  initSocket: () => void;
  markNotificationAsSeen: (notificationId: string) => void;
}

export const useNotificationSocketStore = create<INotificationSocketStore>(
  (set) => {
    const feedbackStore = useFeedbackStore.getState();
    const notificationStore = useNotificationStore.getState();

    const socket = io(process.env.NEXT_PUBLIC_CHAT_NOTIFICATION_URL as string, {
      withCredentials: true,
    });

    socket.on("error", (error) => {
      feedbackStore.addMessage(error);
    });

    socket.on("notifications-info", (data) => {
      notificationStore.setNotifications(data);
    });

    socket.on("updated-notification", (data) => {
      notificationStore.updateNotification(data);
    });

    return {
      socket: socket,
      initSocket: () => {
        socket.emit("connected");
      },
      markNotificationAsSeen: (notificationId: string) => {
        socket.emit("mark-notification-as-seen", {
          notificationId: notificationId,
        });
      },
    };
  }
);
