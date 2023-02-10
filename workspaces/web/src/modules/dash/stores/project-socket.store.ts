import { useDevAuthStore } from "modules/auth/store/auth-store";
import { ProjectApplicationType } from "modules/dash/hooks/useGetMyProjectsQuery";
import { useConnectionStore } from "modules/dash/stores/connections.store";
import { useProjectStrore } from "modules/dash/stores/project.store";
import { io, Socket } from "socket.io-client";
import create from "zustand";

export interface IDashProjectSocketStore {
  socket: Socket;
  applyToJoinProject: (projectId: string) => void;
  initSocket: (developerId: string) => void
}

export const useDashProjectSocketStore = create<IDashProjectSocketStore>((set) => {
  const projectStore = useProjectStrore.getState();

  const socket = io(process.env.NEXT_PUBLIC_PROJECT_WEBSOCKET_URL as string, {
    withCredentials: true,
  });

  socket.on("new-application", (data: ProjectApplicationType) => {
    projectStore.addProjectApplication(data);
  });

  socket.on("project-aplication-update", (data: ProjectApplicationType[]) => {
    projectStore.setMyProjectApplications(data);
  });

  return {
    socket: socket,
    applyToJoinProject: (projectid: string) => {
      socket.emit("apply-to-project", { projectId: projectid })
    },
    initSocket: (developerId: any) => {
      socket.emit("connected", {
        developerId: developerId
      });
    }
  };
});
