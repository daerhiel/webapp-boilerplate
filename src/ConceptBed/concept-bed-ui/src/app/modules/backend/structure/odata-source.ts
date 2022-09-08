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
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly entries$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // TODO: Fugure out change detection issue (change to false).
  private readonly length$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly current: { page: PageEvent | null; sort: Sort | null; } = { page: null, sort: null };
  private readonly requests: Subject<ODataQuery<T>> = new Subject();
  private filter$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private paginator$: MatPaginator | undefined;
  private $paginator: Subscription | undefined;
  private sort$: MatSort | undefined;
  private $sort: Subscription | undefined;

  readonly loading: Observable<boolean> = this.loading$.asObservable();
  readonly length: Observable<number> = this.length$.asObservable();

  get filter(): string | undefined { return this.filter$.value; }
  set filter(value: string | undefined) { this.filter$.next(value); }

  get paginator(): MatPaginator | undefined { return this.paginator$; }
  set paginator(value: MatPaginator | undefined) {
    if (this.paginator$ !== value) {
      this.$paginator?.unsubscribe();
      this.paginator$ = value;
      this.$paginator = this.paginator$?.page.pipe(tap(page => {
        this.current.page = page;
        this.load(this.filter$.value, page, this.current.sort);
      })).subscribe();
    }
  }

  get sort(): MatSort | undefined { return this.sort$; }
  set sort(value: MatSort | undefined) {
    if (this.sort$ !== value) {
      this.$sort?.unsubscribe();
      this.sort$ = value;
      this.$sort = this.sort$?.sortChange.pipe(tap(sort => {
        this.current.sort = sort;
        this.load(this.filter$.value, this.current.page, sort);
      })).subscribe();
    }
  }

  constructor(private readonly endpoint: ODataEndpointFn<T>, private readonly factory?: ODataFilterBuilderFn) {
    this.subscriptions.subscribe(this.requests.pipe(switchMap(query => {
      this.loading$.next(true);
      return this.endpoint(query).pipe(
        tap(x => {
          this.length$.next(x.count);
          this.entries$.next(x.elements);
        }),
        finalize(() => this.loading$.next(false))
      );
    })));
    this.subscriptions.subscribe(this.filter$.pipe(skip(1), distinctUntilChanged(), debounceTime(300), tap(filter => {
      this.load(filter, this.current.page, this.current.sort)
    })));
  }

  complete() {
    this.subscriptions.unsubscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    if (!!this.paginator$) {
      this.current.page = { pageIndex: this.paginator$.pageIndex, pageSize: this.paginator$.pageSize, length: this.paginator$.length };
    }
    if (!!this.sort$ && !!this.sort$.active) {
      this.current.sort = { active: this.sort$.active, direction: this.sort$.direction ?? this.sort$.start }
    }
    this.load(this.filter$.value, this.current.page, this.current.sort);
    return this.entries$.asObservable();
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
    this.requests.next(query);
  }
}
