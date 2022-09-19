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

  it('should create an instance', () => {
    expect(source).toBeTruthy();
  });

  it('should detect datasource instance', () => {
    expect(isDataSource(source)).toBeTruthy();
  });

  it('should connect to datasource', async () => {
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    expect(connection).toBeTruthy();
    expect(source.observed).toBeTrue();
    expect(await firstValueFrom(source.loading$)).toBeTrue();
  });

  it('should disconnect from datasource', async () => {
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);
    subscriptions.unsubscribe();

    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    expect(source.observed).toBeFalse();
    expect(await firstValueFrom(source.loading$)).toBeFalse();
  });

  it('should send loading on connect', async () => {
    expect(await firstValueFrom(source.loading$)).toBeFalse();

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

    const request = firstValueFrom(connection);
    expect(await request).toEqual(content);
  });

  it('should filter data', async () => {
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const request = firstValueFrom(connection);
    expect(await request).toEqual(content);
  });
});
