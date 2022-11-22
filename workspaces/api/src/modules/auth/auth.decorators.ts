import { SetMetadata } from "@nestjs/common";
import { AuthRolesEnum } from "./auth.enums";

export const ROLES_KEY = "roles";
export const Roles = (...roles: AuthRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
