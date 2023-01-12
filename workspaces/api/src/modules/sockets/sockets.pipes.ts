import { Injectable, ValidationPipe } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    console.log("hello11111111111");
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException("Bad request");
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException(errors);
    };
  }
}
