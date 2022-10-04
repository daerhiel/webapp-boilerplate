import { CollectionViewer } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, map, Observable, shareReplay, skip, Subject, Subscription, switchMap, tap } from "rxjs";

import { Subscriptions } from "@modules/services/services.module";
import { ODataQuery } from "./odata-query";
import { ODataResultSet } from "./odata-result-set";

type Values<T extends object> = keyof T;
const properties: Values<ODataQuery<any>>[] = ["$filter", "$expand", "$orderby", "$top", "$skip"];

export interface ODataEndpointFn<T> {
  (query: ODataQuery<T>): Observable<ODataResultSet<T>>;
}

export interface ODataFilterBuilderFn {
  (query: string | undefined): string | undefined;
}

export function queryComparator<T>(x: ODataQuery<T>, y: ODataQuery<T>): boolean {
  for (const name of properties) {
    if (x[name as keyof ODataQuery<T>] !== y[name as keyof ODataQuery<T>]) {
      return false;
    }
  }
  return true;
}

export class ODataSource<T> implements DataSource<T> {
  private readonly _subscriptions: Subscriptions = new Subscriptions();
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _filter = new BehaviorSubject<string | undefined>(undefined);
  private readonly _current: { page: PageEvent | null; sort: Sort | null; } = { page: null, sort: null };
  private readonly _queries = new BehaviorSubject<ODataQuery<T>>(this._getQuery());
  private _paginator: MatPaginator | null | undefined;
  private $paginator: Subscription | undefined;
  private _sort: MatSort | null | undefined;
  private $sort: Subscription | undefined;

  private readonly entries$: Observable<T[]> = this._queries.pipe(
    distinctUntilChanged(queryComparator),
    switchMap(query => {
      this._loading.next(true);
      return this._endpoint(query).pipe(
        map(x => {
          this._updatePaginator(x.count);
          return x.elements;
        }),
        finalize(() => this._loading.next(false))
      );
    }), shareReplay(1));

  readonly filter$: Observable<string | undefined> = this._filter.asObservable();
  readonly loading$: Observable<boolean> = this._loading.asObservable();

  get filter(): string | undefined { return this._filter.value; }
  set filter(value: string | undefined) { this._filter.next(value); }

  get paginator(): MatPaginator | null | undefined { return this._paginator; }
  set paginator(value: MatPaginator | null | undefined) {
    if (this._paginator !== value) {
      this.$paginator?.unsubscribe();
      this._paginator = value;
      this.$paginator = this._paginator?.page.pipe(tap(page => {
        this._current.page = page;
        this._queries.next(this._getQuery());
      })).subscribe();
    }
  }

  get sort(): MatSort | null | undefined { return this._sort; }
  set sort(value: MatSort | null | undefined) {
    if (this._sort !== value) {
      this.$sort?.unsubscribe();
      this._sort = value;
      this.$sort = this._sort?.sortChange.pipe(tap(sort => {
        this._current.sort = sort;
        this._queries.next(this._getQuery());
      })).subscribe();
    }
  }

  constructor(private readonly _endpoint: ODataEndpointFn<T>, private readonly _factory?: ODataFilterBuilderFn) {
    this._subscriptions.subscribe(this._filter.pipe(skip(1), distinctUntilChanged(), debounceTime(300), tap(filter => {
      if (this._paginator && this._current.page) {
        this._paginator.pageIndex = this._current.page.pageIndex = 0;
      }
      this._queries.next(this._getQuery());
    })));
  }

  private _getQuery(): ODataQuery<T> {
    const query: ODataQuery<T> = {};
    let filter = this._filter.value;
    if (filter && this._factory) {
      filter = this._factory(filter);
    }
    if (filter) {
      query.$filter = filter;
    }
    const page = this._current.page;
    if (page) {
      query.$top = page.pageSize;
      query.$skip = page.pageIndex * query.$top;
    }
    const sort = this._current.sort;
    if (sort) {
      query.$orderby = `${sort.active} ${sort.direction}`;
    }
    return query;
  }

  private _updatePaginator(length: number) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;
      if (paginator) {
        paginator.length = length;

        if (paginator.pageIndex > 0) {
          const oldPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
          const newPageIndex = Math.min(paginator.pageIndex, oldPageIndex);

          if (newPageIndex !== paginator.pageIndex) {
            paginator.pageIndex = newPageIndex;
          }
        }
      }
    });
  }

  complete() {
    this._subscriptions.unsubscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    if (this._paginator) {
      const { pageIndex, pageSize, length } = this._paginator;
      this._current.page = { pageIndex, pageSize, length };
    }
    if (this._sort?.active) {
      const { active, direction } = this._sort;
      this._current.sort = { active, direction: direction ?? this._sort.start }
    }
    this._queries.next(this._getQuery());
    return this.entries$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
