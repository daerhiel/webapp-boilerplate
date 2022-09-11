import { OperatorFunction } from 'rxjs';
import { operate } from 'rxjs/internal/util/lift';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';

export function isInstanceOf<T, R extends T>(type: new (...args: any[]) => R) {
  return (value: T): value is R => value instanceof type;
}

export function guard<T, R extends T>(guard: (value: T) => value is R, thisArg?: any): OperatorFunction<T, R> {
  return operate((source, subscriber) => {
    source.subscribe(createOperatorSubscriber(subscriber, (value: T) => guard.call(thisArg, value) && subscriber.next(value as R)));
  });
}
