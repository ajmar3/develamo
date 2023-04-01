import {
  ArgumentsHost,
  Catch,
  HttpException,
  Injectable,
  ValidationPipe,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException("Bad request");
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException(errors);
    };
  }
}

@Catch(WsException, HttpException)
export class WsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  public handleError(client: Socket, exception: HttpException | WsException) {
    if (exception instanceof HttpException) {
      client.emit("error", exception.getResponse());
      // throw exception;
    } else {
      client.emit("error", exception);
    }
  }
}
