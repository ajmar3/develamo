import { Socket } from "socket.io";

export interface IValidatedSocket extends Socket {
  user: {
    id: string;
  };
}
