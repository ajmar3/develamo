import { faTags } from "@fortawesome/free-solid-svg-icons";
import create from "zustand";

export interface IConnectionStore {
  connections: any[],
  setConnections: (cons: any[]) => void
  sentRequests: any[],
  setSentRequests: (requests: any[]) => void
  addSentRequest: (request: any) => void
  connectionRequests: any[]
  setConnectionRequests: (requests: any[]) => void
}

export const useConnectionStore = create<IConnectionStore>(set => ({
  connections: [],
  setConnections: (cons: any[]) => set(state => ({ connections: cons })),
  sentRequests: [],
  setSentRequests: (requests: any[]) => set(state => ({ sentRequests: requests })),
  addSentRequest: (request: any) => set(state => ({ sentRequests: [...state.sentRequests, request] })),
  connectionRequests: [],
  setConnectionRequests: (requests: any[]) => set(state => ({ connectionRequests: requests })),
}));