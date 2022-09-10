import { TestScheduler } from "rxjs/testing";

import { guard, isInstanceOf } from "./guard";

class Base { constructor(public value: number) { } }
class Derived1 extends Base { }
class Derived2 extends Base { }

const empty: { [name: string]: any } = {};
const instances = { 0: new Base(0), 1: new Derived1(1), 2: new Base(2), 3: new Derived2(3), 4: new Base(4) };
const types = { 0: 0, 1: '1', 2: 2, 3: '3', 4: 4 };
const objects = { 0: { n: 0 }, 1: { s: '1' }, 2: { n: 2 }, 3: { s: '3' }, 4: { n: 4 } };

describe('guard', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should guard empty stream', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  ---|', empty);
      const e1subs = '  ^--!';
      const expected = '---|';

      expectObservable(e1.pipe(guard((x: any): x is any => x))).toBe(expected, empty);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard instanceof base type', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', instances);
      const e1subs = '  ^----------------!';
      const expected = '--0--1--2--3--4--|';

      expectObservable(e1.pipe(guard(isInstanceOf(Base)))).toBe(expected, instances);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard instanceof type 1', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', instances);
      const e1subs = '  ^----------------!';
      const expected = '-----1-----------|';

      expectObservable(e1.pipe(guard(isInstanceOf(Derived1)))).toBe(expected, instances);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard instanceof type 2', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', instances);
      const e1subs = '  ^----------------!';
      const expected = '-----------3-----|';

      expectObservable(e1.pipe(guard(isInstanceOf(Derived2)))).toBe(expected, instances);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard typeof string', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', types);
      const e1subs = '  ^----------------!';
      const expected = '-----1-----3-----|';

      expectObservable(e1.pipe(guard((x: any): x is any => typeof x === 'string'))).toBe(expected, types);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard typeof number', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', types);
      const e1subs = '  ^----------------!';
      const expected = '--0-----2-----4--|';

      expectObservable(e1.pipe(guard((x: any): x is any => typeof x === 'number'))).toBe(expected, types);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard object of string', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', objects);
      const e1subs = '  ^----------------!';
      const expected = '-----1-----3-----|';

      expectObservable(e1.pipe(guard((x: any): x is any => x && (x as { s: number }).s !== undefined))).toBe(expected, objects);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('should guard object of string', () => {
    testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
      const e1 = hot('  --0--1--2--3--4--|', objects);
      const e1subs = '  ^----------------!';
      const expected = '--0-----2-----4--|';

      expectObservable(e1.pipe(guard((x: any): x is any => x && (x as { n: number }).n !== undefined))).toBe(expected, objects);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
