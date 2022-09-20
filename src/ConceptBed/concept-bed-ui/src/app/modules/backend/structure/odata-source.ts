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

export function queriesEqual<T>(x: ODataQuery<T>, y: ODataQuery<T>): boolean {
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
  private readonly _length = new BehaviorSubject<number>(0);
  private readonly _filter = new BehaviorSubject<string | undefined>(undefined);
  private readonly _current: { page: PageEvent | null; sort: Sort | null; } = { page: null, sort: null };
  private readonly _requests = new BehaviorSubject<ODataQuery<T>>(this.getRequest());
  private _paginator: MatPaginator | undefined;
  private $paginator: Subscription | undefined;
  private _sort: MatSort | undefined;
  private $sort: Subscription | undefined;

  private readonly entries$: Observable<T[]> = this._requests.pipe(
    distinctUntilChanged(queriesEqual),
    switchMap(query => {
      this._loading.next(true);
      return this.endpoint(query).pipe(
        map(x => {
          this._length.next(x.count);
          return x.elements;
        }),
        finalize(() => this._loading.next(false))
      );
    }), shareReplay(1));

  readonly filter$: Observable<string | undefined> = this._filter.asObservable();
  readonly length$: Observable<number> = this._length.asObservable();
  readonly loading$: Observable<boolean> = this._loading.asObservable();

  get filter(): string | undefined { return this._filter.value; }
  set filter(value: string | undefined) { this._filter.next(value); }

  get paginator(): MatPaginator | undefined { return this._paginator; }
  set paginator(value: MatPaginator | undefined) {
    if (this._paginator !== value) {
      this.$paginator?.unsubscribe();
      this._paginator = value;
      this.$paginator = this._paginator?.page.pipe(tap(page => {
        this._current.page = page;
        this._requests.next(this.getRequest());
      })).subscribe();
    }
  }

  get sort(): MatSort | undefined { return this._sort; }
  set sort(value: MatSort | undefined) {
    if (this._sort !== value) {
      this.$sort?.unsubscribe();
      this._sort = value;
      this.$sort = this._sort?.sortChange.pipe(tap(sort => {
        this._current.sort = sort;
        this._requests.next(this.getRequest());
      })).subscribe();
    }
  }

  constructor(private readonly endpoint: ODataEndpointFn<T>, private readonly factory?: ODataFilterBuilderFn) {
    this._subscriptions.subscribe(this._filter.pipe(skip(1), distinctUntilChanged(), debounceTime(300), tap(filter => {
      if (this._paginator && this._current.page) {
        this._paginator.pageIndex = this._current.page.pageIndex = 0;
      }
      this._requests.next(this.getRequest());
    })));
  }

  private getRequest(): ODataQuery<T> {
    const query: ODataQuery<T> = {};
    let filter = this._filter.value;
    if (filter && this.factory) {
      filter = this.factory(filter);
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
    this._requests.next(this.getRequest());
    return this.entries$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
