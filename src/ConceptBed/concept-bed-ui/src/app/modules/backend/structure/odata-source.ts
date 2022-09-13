import { CollectionViewer } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable, skip, Subject, Subscription, switchMap, tap } from "rxjs";

import { Subscriptions } from "@modules/services/services.module";
import { ODataQuery } from "./odata-query";
import { ODataResultSet } from "./odata-result-set";

export interface ODataEndpointFn<T> {
  (query: ODataQuery<T>): Observable<ODataResultSet<T>>;
}

export interface ODataFilterBuilderFn {
  (query: string | undefined): string | undefined;
}

export class ODataSource<T> implements DataSource<T> {
  private readonly _subscriptions: Subscriptions = new Subscriptions();
  private readonly _entries = new BehaviorSubject<T[]>([]);
  private readonly _loading = new BehaviorSubject<boolean>(true); // TODO: Fugure out change detection issue (change to false).
  private readonly _length = new BehaviorSubject<number>(0);
  private readonly _filter = new BehaviorSubject<string | undefined>(undefined);
  private readonly _current: { page: PageEvent | null; sort: Sort | null; } = { page: null, sort: null };
  private readonly _requests: Subject<ODataQuery<T>> = new Subject();
  private _paginator: MatPaginator | undefined;
  private $paginator: Subscription | undefined;
  private _sort: MatSort | undefined;
  private $sort: Subscription | undefined;

  readonly loading$: Observable<boolean> = this._loading.asObservable();
  readonly length$: Observable<number> = this._length.asObservable();

  get filter(): string | undefined { return this._filter.value; }
  set filter(value: string | undefined) { this._filter.next(value); }

  get paginator(): MatPaginator | undefined { return this._paginator; }
  set paginator(value: MatPaginator | undefined) {
    if (this._paginator !== value) {
      this.$paginator?.unsubscribe();
      this._paginator = value;
      this.$paginator = this._paginator?.page.pipe(tap(page => {
        this._current.page = page;
        this.load(this._filter.value, page, this._current.sort);
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
        this.load(this._filter.value, this._current.page, sort);
      })).subscribe();
    }
  }

  constructor(private readonly endpoint: ODataEndpointFn<T>, private readonly factory?: ODataFilterBuilderFn) {
    this._subscriptions.subscribe(this._requests.pipe(switchMap(query => {
      this._loading.next(true);
      return this.endpoint(query).pipe(
        tap(x => {
          this._length.next(x.count);
          this._entries.next(x.elements);
        }),
        finalize(() => this._loading.next(false))
      );
    })));
    this._subscriptions.subscribe(this._filter.pipe(skip(1), distinctUntilChanged(), debounceTime(300), tap(filter => {
      this.load(filter, this._current.page, this._current.sort)
    })));
  }

  complete() {
    this._subscriptions.unsubscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    if (!!this._paginator) {
      this._current.page = { pageIndex: this._paginator.pageIndex, pageSize: this._paginator.pageSize, length: this._paginator.length };
    }
    if (!!this._sort && !!this._sort.active) {
      this._current.sort = { active: this._sort.active, direction: this._sort.direction ?? this._sort.start }
    }
    this.load(this._filter.value, this._current.page, this._current.sort);
    return this._entries.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  load(filter: string | undefined, page: PageEvent | null, sort: Sort | null): void {
    const query: ODataQuery<T> = {};
    if (!!this.factory) {
      const $filter = this.factory(filter);
      if (!!$filter) {
        query.$filter = $filter;
      }
    }
    if (!!page) {
      query.$top = page.pageSize;
      query.$skip = page.pageIndex * query.$top;
    }
    if (!!sort) {
      query.$orderby = `${sort.active} ${sort.direction}`;
    }
    this._requests.next(query);
  }
}
