import { EventEmitter } from '@angular/core';
import { CollectionViewer, isDataSource, ListRange } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
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

class TestPaginator {
  pageIndex: number = 0;

  page: EventEmitter<PageEvent> = new EventEmitter();

  constructor(public length: number, public pageSize: number) {
  }

  nextPage(): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.min(this.getNumberOfPages() - 1, previousPageIndex + 1);
    const { length, pageIndex, pageSize } = this;
    this.page.emit({ length, pageIndex, pageSize, previousPageIndex });
  }

  previousPage(): void {
  }

  firstPage(): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    const { length, pageIndex, pageSize } = this;
    this.page.emit({ length, pageIndex, pageSize, previousPageIndex });
  }

  lastPage(): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.min(this.getNumberOfPages() - 1, 0);
    const { length, pageIndex, pageSize } = this;
    this.page.emit({ length, pageIndex, pageSize, previousPageIndex });
  }

  hasPreviousPage(): boolean {
    return this.pageIndex > 0;
  }

  hasNextPage(): boolean {
    return this.pageIndex < this.getNumberOfPages();
  }

  getNumberOfPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }
}

const filterContent = <T>(filter: string | null | undefined): (value: T, index: number, array: T[]) => unknown => x => {
  if (filter) {
    for (const name in x) {
      const value = x[name as keyof T];
      if (typeof value === 'string' && value.includes(filter)) {
        return true;
      }
    }
    return false;
  }
  return true;
};

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
    source = new ODataSource<Data>(query => {
      return of(create(content.filter(filterContent(query.$filter)), query.$top, query.$skip)).pipe(delay(100))
    });
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

  it('should get paginated data on connect', async () => {
    const pageSize = 10;
    source.paginator = new TestPaginator(content.length, pageSize) as any;
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    await (firstValueFrom(timer(300)));
    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const request = firstValueFrom(connection);
    expect(await request).toEqual(content.slice(0, pageSize));
    expect(await firstValueFrom(source.length$)).toEqual(content.length);
  });

  it('should filter data', async () => {
    const filter = '5';
    source.filter = filter;
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const request = firstValueFrom(connection);
    const result = content.filter(x => x.text.includes(filter));
    expect(await request).toEqual(result);
    expect(await firstValueFrom(source.length$)).toEqual(result.length);
  });

  it('should filter paginated data', async () => {
    const filter = '5';
    const pageSize = 10;
    source.filter = filter;
    source.paginator = new TestPaginator(content.length, pageSize) as any;
    const connection = source.connect(viewer);
    subscriptions.subscribe(connection);

    while (await firstValueFrom(source.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const request = firstValueFrom(connection);
    const expected = content.filter(x => x.text.includes(filter));
    expect(await request).toEqual(expected.slice(0, pageSize));
    expect(await firstValueFrom(source.length$)).toEqual(expected.length);
  });
});
