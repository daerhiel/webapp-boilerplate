import { CollectionViewer } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable, skip, Subject, Subscription, switchMap, tap } from "rxjs";

import { ODataQuery } from "./odata-query";
import { ODataResultSet } from "./odata-result-set";

export interface ODataEndpointFn<T> {
  (query: ODataQuery): Observable<ODataResultSet<T>>;
}

export interface ODataFilterBuilderFn {
  (query: string | undefined): string | undefined;
}

export class ODataSource<T> implements DataSource<T> {
  private readonly subscriptions: Subscription[] = [];
  private readonly entries$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // TODO: Fugure out change detection issue (change to false).
  private readonly length$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly current: { page: PageEvent | null; sort: Sort | null; } = { page: null, sort: null };
  private readonly requests: Subject<ODataQuery> = new Subject();
  private filter$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private paginator$: MatPaginator | undefined;
  private $paginator: Subscription | undefined;
  private sort$: MatSort | undefined;
  private $sort: Subscription | undefined;

  public readonly loading: Observable<boolean> = this.loading$.asObservable();
  public readonly length: Observable<number> = this.length$.asObservable();

  public get filter(): string | undefined { return this.filter$.value; }
  public set filter(value: string | undefined) { this.filter$.next(value); }

  public get paginator(): MatPaginator | undefined { return this.paginator$; }
  public set paginator(value: MatPaginator | undefined) {
    if (this.paginator$ !== value) {
      this.$paginator?.unsubscribe(), this.$paginator = undefined;
      this.paginator$ = value;
      this.$paginator = this.paginator$?.page.pipe(tap(page => {
        this.current.page = page;
        this.load(this.filter$.value, page, this.current.sort);
      })).subscribe();
    }
  }

  public get sort(): MatSort | undefined { return this.sort$; }
  public set sort(value: MatSort | undefined) {
    if (this.sort$ !== value) {
      this.$sort?.unsubscribe(), this.$sort = undefined;
      this.sort$ = value;
      this.$sort = this.sort$?.sortChange.pipe(tap(sort => {
        this.current.sort = sort;
        this.load(this.filter$.value, this.current.page, sort);
      })).subscribe();
    }
  }

  public constructor(private readonly endpoint: ODataEndpointFn<T>, private readonly factory?: ODataFilterBuilderFn) {
    this.subscriptions.push(this.requests.pipe(switchMap(query => {
      this.loading$.next(true);
      return this.endpoint(query).pipe(
        tap(x => {
          this.length$.next(x.count);
          this.entries$.next(x.elements);
        }),
        finalize(() => this.loading$.next(false))
      );
    })).subscribe());
    this.subscriptions.push(this.filter$.pipe(skip(1), distinctUntilChanged(), debounceTime(300), tap(filter => {
      this.load(filter, this.current.page, this.current.sort)
    })).subscribe());
  }

  public complete() {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    if (!!this.paginator$) {
      this.current.page = { pageIndex: this.paginator$.pageIndex, pageSize: this.paginator$.pageSize, length: this.paginator$.length };
    }
    if (!!this.sort$ && !!this.sort$.active) {
      this.current.sort = { active: this.sort$.active, direction: this.sort$.direction ?? this.sort$.start }
    }
    this.load(this.filter$.value, this.current.page, this.current.sort);
    return this.entries$.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
  }

  public load(filter: string | undefined, page: PageEvent | null, sort: Sort | null): void {
    const query: ODataQuery = {};
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
