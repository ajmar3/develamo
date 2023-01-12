import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./auth.decorators";
import { AuthRolesEnum } from "./auth.enums";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const cookies = client.handshake.headers.cookie;
    if (!cookies) return false;

    const cookie = cookies
      .split("; ")
      .find((cookie: string) => cookie.startsWith("Authorization"));

    if (!cookie) return false;
    const token = cookie.split("=")[1];
    const decodedToken = this.jwtService.decode(token) as any;
    client.user = { id: decodedToken.id };
    const requiredRoles = this.reflector.getAllAndOverride<AuthRolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    return requiredRoles.some((role) => decodedToken.roles?.includes(role));
  }
}
