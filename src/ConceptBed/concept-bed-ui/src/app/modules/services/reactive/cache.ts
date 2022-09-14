import { Observable, ObservableInput, ObservedValueOf, of, OperatorFunction, Subscriber } from "rxjs";
import { operate } from 'rxjs/internal/util/lift';
import { innerFrom } from 'rxjs/internal/observable/innerFrom';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';

export interface CacheInstance<R> {
  [id: string | number]: ObservableInput<R>
}

export function fromCache<T extends string | number, R>(value: T, cache: CacheInstance<R>): Observable<R> | undefined {
  const observable = cache[value];
  return observable ? innerFrom(observable) : undefined;
}

export function cacheMap<T extends string | number, R, O extends ObservableInput<any>>(cache: CacheInstance<R>,
  project: (value: T, index: number) => O
): OperatorFunction<T, ObservedValueOf<O> | R> {
  return operate((source, subscriber) => {
    let innerSubscriber: Subscriber<ObservedValueOf<O>> | null = null;
    let index = 0;
    let isComplete = false;

    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
    source.subscribe(createOperatorSubscriber(subscriber, (value: T) => {
      innerSubscriber?.unsubscribe();
      const outerIndex = index++;

      const inner = cache[value] ?? (cache[value] = project(value, outerIndex));
      innerFrom(inner).subscribe((innerSubscriber = createOperatorSubscriber(
        subscriber,
        (innerValue: ObservedValueOf<O>) => subscriber.next(innerValue),
        () => { innerSubscriber = null; checkComplete(); }
      )));
    }, () => { isComplete = true; checkComplete(); }));
  });
}
