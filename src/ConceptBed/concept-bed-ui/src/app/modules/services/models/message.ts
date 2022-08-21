import { MessageType } from './message-type.enum';

export class Message {
  type: MessageType;
  text: string;
  canClose: boolean;
  timeout: number;

  constructor(type: MessageType, message: string, timeout: number, canClose: boolean) {
    this.type = type;
    this.text = message;
    this.timeout = timeout;
    this.canClose = canClose;
  }
}
