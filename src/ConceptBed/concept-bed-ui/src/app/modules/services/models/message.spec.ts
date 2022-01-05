import { Message } from './message';
import { MessageType } from './message-type.enum';

describe('Message', () => {
  it('should create an instance', () => {
    expect(new Message(MessageType.Default, 'Test message.', 10000, true)).toBeTruthy();
  });
});
