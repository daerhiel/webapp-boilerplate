import { MessageType } from './message-type.enum';

export class Message {
  type: MessageType;
  text: string;
  canClose: boolean;
  timeout: number;

  constructor(type: MessageType, text: string, timeout: number, canClose: boolean) {
    this.type = type;
    this.text = text;
    this.timeout = timeout;
    this.canClose = canClose;
  }
}
