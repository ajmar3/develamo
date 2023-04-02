import { useEffect, useState } from "react";
import { useNotificationSocketStore } from "../stores/notification-socket.store";
import {
  DashNotificationType,
  useNotificationStore,
} from "../stores/notifications.store";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import { useRouter } from "next/router";
import { useChatSocketStore } from "../stores/chat-socket.store";

export const DashNotifications: React.FC = () => {
  const initSocket = useNotificationSocketStore((state) => state.initSocket);
  const markNotificationAsSeen = useNotificationSocketStore(
    (state) => state.markNotificationAsSeen
  );
  const notifications = useNotificationStore((state) => state.notifications);
  const updateNotification = useNotificationStore(
    (state) => state.updateNotification
  );
  const developerId = useDevAuthStore((state) => state.devInfo?.id);

  const [seenNotifications, setSeenNotifications] = useState<
    DashNotificationType[]
  >([]);
  const [unseenNotifications, setUnseenNotifications] = useState<
    DashNotificationType[]
  >([]);
  const openChat = useChatSocketStore(state => state.openChat);

  const router = useRouter();

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    setSeenNotifications(notifications.filter((x) => x.seen == true));
    setUnseenNotifications(notifications.filter((x) => x.seen == false));
  }, [notifications]);

  const handleMarkAsRed = (notification: DashNotificationType) => {
    markNotificationAsSeen(notification.id);
    updateNotification(notification);
  };

  const handleClickOn = (notification: DashNotificationType) => {
    markNotificationAsSeen(notification.id);
    updateNotification(notification);

    if (notification.referencedProject) {
      if (notification.message.toLowerCase().includes("removed")) return;
      router.push("/project/" + notification.referencedProject.id + "/chat");
      return;
    }
    else if (notification.referencedDeveloper) {

    }
    else if (notification.referencedChat) {
      openChat(notification.referencedChat.id);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="text-lg p-2">Notifications</div>
      <div className="px-2 pb-2">New</div>
      {unseenNotifications.length > 0 ? (
        <div className="flex flex-col">
          {unseenNotifications.map((x) => {
            if (x.referencedDeveloper) {
              return (
                <div
                  key={x.id}
                  className={
                    x.seen
                      ? `border-base-content border-y p-2 flex items-center`
                      : `bg-base-100 p-2 flex items-center`
                  }
                >
                  <div className="w-4/5 cursor-pointer" onClick={() => handleClickOn(x)}>
                    <div className="font-semibold">
                      {x.referencedDeveloper.name
                        ? x.referencedDeveloper.name
                        : x.referencedDeveloper.githubUsername}
                    </div>
                    <div className="text-xs">{x.message}</div>
                  </div>
                  <div className="w-1/5 flex justify-end p-2">
                    <button
                      className="btn btn-primary btn-xs btn-square"
                      onClick={() => handleMarkAsRed(x)}
                    >
                      <CheckIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              );
            } else if (x.referencedProject) {
              return (
                <div
                  key={x.id}
                  className={
                    x.seen
                      ? `border-base-content border-y p-2 flex items-center`
                      : `bg-base-100 p-2 flex items-center`
                  }
                >
                  <div className="w-4/5 cursor-pointer" onClick={() => handleClickOn(x)}>
                    <div className="font-semibold">
                      {x.referencedProject.title}
                    </div>
                    <div className="text-xs">{x.message}</div>
                  </div>
                  <div className="w-1/5 flex justify-end p-2">
                    <button
                      className="btn btn-primary btn-xs btn-square"
                      onClick={() => handleMarkAsRed(x)}
                    >
                      <CheckIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              );
            } else if (x.referencedChat) {
              const otherDeveloper = x.referencedChat.participants.find(
                (x) => x.id != developerId
              );

              return (
                <div
                  key={x.id}
                  className={
                    x.seen
                      ? `border-base-content border-y p-2 flex items-center`
                      : `bg-base-100 p-2 flex items-center`
                  }
                >
                  <div className="w-4/5 cursor-pointer" onClick={() => handleClickOn(x)}>
                    <div className="font-semibold">
                      {otherDeveloper?.name
                        ? otherDeveloper.name
                        : otherDeveloper?.githubUsername}
                    </div>
                    <div className="text-xs">{x.message}</div>
                  </div>
                  <div className="w-1/5 flex justify-end p-2">
                    <button
                      className="btn btn-primary btn-xs btn-square"
                      onClick={() => handleMarkAsRed(x)}
                    >
                      <CheckIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      ) : (
        <div className="w-full flex justify-center">No new notifications.</div>
      )}
      {seenNotifications.length > 0 && (
        <>
          <div className="p-2">Previous</div>
          <div className="flex flex-col">
            {seenNotifications.map((x) => {
              if (x.referencedDeveloper) {
                return (
                  <div
                    key={x.id}
                    className={
                      x.seen
                        ? `hover:bg-base-100 p-2 flex items-center`
                        : `bg-base-100 p-2 flex items-center`
                    }
                  >
                    <div className="w-full cursor-pointer" onClick={() => handleClickOn(x)}>
                      <div className="font-semibold">
                        {x.referencedDeveloper.name
                          ? x.referencedDeveloper.name
                          : x.referencedDeveloper.githubUsername}
                      </div>
                      <div className="text-xs">{x.message}</div>
                    </div>
                  </div>
                );
              } else if (x.referencedProject) {
                return (
                  <div
                    key={x.id}
                    className={
                      x.seen
                        ? `hover:bg-base-100 p-2 flex items-center`
                        : `bg-base-100 p-2 flex items-center`
                    }
                  >
                    <div className="w-full cursor-pointer" onClick={() => handleClickOn(x)}>
                      <div className="font-semibold">
                        {x.referencedProject.title}
                      </div>
                      <div className="text-xs">{x.message}</div>
                    </div>
                  </div>
                );
              } else if (x.referencedChat) {
                const otherDeveloper = x.referencedChat.participants.find(
                  (x) => x.id != developerId
                );

                return (
                  <div
                    key={x.id}
                    className={
                      x.seen
                        ? `hover:bg-base-100 p-2 flex items-center`
                        : `bg-base-100 p-2 flex items-center`
                    }
                  >
                    <div className="w-full cursor-pointer" onClick={() => handleClickOn(x)}>
                      <div className="font-semibold">
                        {otherDeveloper?.name
                          ? otherDeveloper.name
                          : otherDeveloper?.githubUsername}
                      </div>
                      <div className="text-xs">{x.message}</div>
                    </div>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};
