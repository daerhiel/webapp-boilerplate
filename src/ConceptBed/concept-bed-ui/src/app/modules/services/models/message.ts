import { MessageType } from './message-type.enum';

export class Message {
  public type: MessageType;
  public text: string;
  public canClose: boolean;
  public timeout: number;

  public constructor(type: MessageType, message: string, timeout: number, canClose: boolean) {
    this.type = type;
    this.text = message;
    this.timeout = timeout;
    this.canClose = canClose;
  }
}
