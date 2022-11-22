import { Request } from "express";

export interface IValidatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    githubUsername: string;
    avatarURL: string;
  };
}
