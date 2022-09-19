import { CollectionViewer, isDataSource, ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, firstValueFrom, Observable, of, timer } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as uuid from 'uuid';

import { Subscriptions } from '@modules/services/services.module';
import { create } from './odata-result-set';
import { ODataSource } from './odata-source';

interface Data {
  index: number;
  text: string;
}

const content: Data[] = [...Array(100).keys()].map(x => ({ index: x, text: uuid.v4() }));

class TestCollectionViewer implements CollectionViewer {
  viewChange: Observable<ListRange> = new BehaviorSubject<{ start: number; end: number }>({
    start: 0,
    end: Number.MAX_VALUE,
  });
}

describe('ODataSource', () => {
  const subscriptions = new Subscriptions();
  const viewer = new TestCollectionViewer();
  let source: ODataSource<Data>;

  beforeEach(() => {
    source = new ODataSource<Data>(query => of(create(content.filter(x => {
      if (query.$filter) {
        return x.text.includes(query.$filter);
      }
      return true;
    }))).pipe(delay(100)));
  });

  it('should create an instance', async () => {
    expect(source).toBeTruthy();
    expect(await firstValueFrom(source.loading$)).toBeFalse();
  });

  it('should detect datasource instance', () => {
    expect(isDataSource(source)).toBeTruthy();
  });

  it('should connect to datasource', async () => {
    const connection = source.connect(viewer);

    expect(connection).toBeTruthy();
  });

  it('should not load on connect', async () => {
    const connection = source.connect(viewer);

    expect(connection).toBeTruthy();
    expect(await firstValueFrom(source.loading$)).toBeFalse();
    expect(await firstValueFrom(source.length$)).toEqual(0);
  });

  it('should load on connection subscribe', async () => {
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    expect(await firstValueFrom(source.loading$)).toBeTrue();
    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }
    expect(await firstValueFrom(source.loading$)).toBeFalse();
  });

  it('should get data on connect', async () => {
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    expect(await firstValueFrom(connection)).toEqual(content);
    expect(await firstValueFrom(source.length$)).toEqual(content.length);
  });

  it('should filter data', async () => {
    const filter = '5';
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);
    source.filter = filter;

    await (firstValueFrom(timer(300)));
    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const request = firstValueFrom(connection);
    const result = content.filter(x => x.text.includes(filter));
    expect(await request).toEqual(result);
    expect(await firstValueFrom(source.length$)).toEqual(result.length);
  });
});
