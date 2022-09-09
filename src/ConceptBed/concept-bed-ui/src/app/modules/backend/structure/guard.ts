import { OperatorFunction } from 'rxjs';
import { operate } from 'rxjs/internal/util/lift';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';

export function guard<T, R extends T>(guard: (value: T) => value is R, thisArg?: any): OperatorFunction<T, R> {
  return operate((source, subscriber) => {
    source.subscribe(createOperatorSubscriber(subscriber, value => guard.call(thisArg, value) && subscriber.next(value as R)));
  });
}
