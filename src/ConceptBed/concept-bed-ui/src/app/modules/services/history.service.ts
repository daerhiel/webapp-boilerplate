import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { guard, isInstanceOf } from './reactive/guard';
import { Subscriptions } from './models/subscriptions';
import { getPath, NavigationTarget } from './models/navigation-target';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnDestroy {
  private readonly _subscriptions: Subscriptions = new Subscriptions();
  private readonly _segment = new BehaviorSubject<NavigationTarget | null>(null);
  private readonly _activated = new BehaviorSubject<NavigationTarget[]>([]);
  private readonly _container = new BehaviorSubject<NavigationTarget[]>([]);
  private readonly _breadcrumbs = new BehaviorSubject<NavigationTarget[]>([]);
  private readonly _navigations: NavigationTarget[] = [];

  get segment(): NavigationTarget | null { return this._segment.value; }
  get activated(): NavigationTarget[] { return this._activated.value; }
  get container(): NavigationTarget[] { return this._container.value; }
  get breadcrumbs(): NavigationTarget[] { return this._breadcrumbs.value; }
  get navigations(): NavigationTarget[] { return this._navigations; }

  readonly segment$: Observable<NavigationTarget | null> = this._segment.asObservable();
  readonly activated$: Observable<NavigationTarget[]> = this._activated.asObservable();
  readonly container$: Observable<NavigationTarget[]> = this._container.asObservable();
  readonly breadcrumbs$: Observable<NavigationTarget[]> = this._breadcrumbs.asObservable();

  constructor(private route: ActivatedRoute, private router: Router) {
    this._subscriptions.subscribe(this.router.events.pipe(guard(isInstanceOf(NavigationEnd)), tap(event => {
      this.handleNavigation(event);
    })));
  }

  private isSameContainer(segments: NavigationTarget[]): boolean {
    return this.container.length <= 2 || segments.length <= 2 && segments.length <= this.container.length;
  }

  private getLastSegmentIndex(segment: NavigationTarget | undefined) {
    if (segment) {
      for (let i = this._navigations.length - 1; i >= 0; i--) {
        if (this._navigations[i].isMatch(segment)) {
          return i;
        }
      }
    }
    return -1;
  }

  private getContainedChain(): NavigationTarget[] {
    if (this.container.length > 0) {
      const segment = this.container[this.container.length - 1];
      const index = this.getLastSegmentIndex(segment);
      if (index >= 0) {
        return this._navigations.slice(index + 1);
      }
    }
    return [];
  }

  private handleNavigation(event: NavigationEnd): void {
    let current: ActivatedRoute | undefined = this.route;
    let segment: NavigationTarget | undefined;
    const segments: NavigationTarget[] = [];
    do {
      if (current?.outlet === 'primary' && current.routeConfig && current.snapshot) {
        segment = segments.find(x => x.isMatch(getPath(current!.snapshot.pathFromRoot)));
        if (segment) {
          segment.update(current.snapshot);
        } else {
          segments.push(segment = new NavigationTarget(current.snapshot));
        }
      }
      current = current?.children.find(x => x.outlet === 'primary');
    } while (current);
    if (segment) {
      const index = this.getLastSegmentIndex(segment);
      if (index < 0 || segments.length <= 2) {
        this._navigations.push(segment);
      } else {
        this._navigations.splice(index + 1);
      }
    }
    this._segment.next(segment ?? null)
    this._activated.next(segments);
    if (this.isSameContainer(segments)) {
      this._container.next(segments);
    }
    this._breadcrumbs.next(this.container.concat(this.getContainedChain()));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  navigateBack(): void {
    this._navigations.pop();
    if (this._navigations.length > 0) {
      const segment = this._navigations[this._navigations.length - 1];
      this.router.navigate(['/'].concat(segment.path), { replaceUrl: true });
    }
  }
}
