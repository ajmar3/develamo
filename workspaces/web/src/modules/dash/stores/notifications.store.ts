import create from "zustand";

export type DashNotificationType = {
  id: string
  message: string
  seen: boolean
  referencedChat?: {
    id: string
    participants: {
      id: string
      githubUsername: string
      name: string
      avatarURL: string
    }[]
  }
  referencedDeveloper?: {
    id: string
    githubUsername: string
    name: string
    avatarURL: string
  }
  referencedProject?: {
    id: string,
    title: string
  }
}

export interface InotificationStore {
  notifications: DashNotificationType[]
  setNotifications: (newNotifications: DashNotificationType[]) => void;
  updateNotification: (notification: DashNotificationType) => void;
}

export const useNotificationStore = create<InotificationStore>((set) => {

  return {
    notifications: [],
    setNotifications: (newNotifications: DashNotificationType[]) => set(state => ({ notifications: newNotifications })),
    updateNotification: (notification: DashNotificationType) => set(state => {
      const current: DashNotificationType[] = JSON.parse(JSON.stringify(state.notifications));
      const notificationIndex = current.findIndex(x => x.id == notification.id);
      if (notificationIndex > -1) {
        current[notificationIndex] = notification;
      }
      return ({ notifications: current });
    })
  };
});
