import { Request } from "express";

export interface IValidatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}
