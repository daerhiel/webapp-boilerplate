import { SafeUrl } from '@angular/platform-browser';
import { map, Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { CacheInstance, cacheMap } from './cache';

describe('cache', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should map-and-flatten each item to an Observable', () => {
    testScheduler.run(({ hot, cold, expectObservable, expectSubscriptions }) => {
      const cache: CacheInstance<number> = {};

      const e1 = hot('   --1-----3--5-------|');
      const e1subs = '   ^------------------!';
      const e2 = cold('    x-x-x|            ', { x: 10 });
      //                         x-x-x|
      //                            x-x-x|
      const expected = ' --x-x-x-y-yz-z-z---|';
      const values = { x: 10, y: 30, z: 50 };

      const result = e1.pipe(cacheMap(cache, x => e2.pipe(map(i => i * +x))));

      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should unsub inner observables', () => {
    const cache: CacheInstance<string> = {};
    const unsubbed: string[] = [];

    of('a', 'b').pipe(cacheMap(cache, x => new Observable<string>(subscriber => {
      subscriber.complete();
      return () => {
        unsubbed.push(x);
      };
    }))).subscribe();

    expect(unsubbed).toEqual(['a', 'b']);
  });

  it('should raise error when projection throws', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const cache: CacheInstance<any> = {};
      const e1 = hot('  -------x-----y---|');
      const e1subs = '  ^------!          ';
      const expected = '-------#          ';

      expectObservable(e1.pipe(cacheMap(cache, (): any[] => {
        throw 'error';
      }))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should switch inner cold observables', () => {
    testScheduler.run(({ hot, cold, expectObservable, expectSubscriptions }) => {
      const cache: CacheInstance<string> = {};
      const x = cold('           --a--b--c--d--e--|           ');
      const xsubs = '   ---------^---------!                  ';
      const y = cold('                     ---f---g---h---i--|');
      const ysubs = '   -------------------^-----------------!';
      const e1 = hot('  ---------x---------y---------|        ');
      const e1subs = '  ^----------------------------!        ';
      const expected = '-----------a--b--c----f---g---h---i--|';

      const observableLookup: Record<string, Observable<string>> = { x: x, y: y };

      const result = e1.pipe(cacheMap(cache, (value) => observableLookup[value]));

      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
