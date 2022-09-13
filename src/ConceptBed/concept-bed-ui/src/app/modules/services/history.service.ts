import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, tap } from 'rxjs';

import { guard, isInstanceOf } from './reactive/guard';
import { Subscriptions } from './models/subscriptions';
import { getPath, NavigationTarget } from './models/navigation-target';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnDestroy {
  private readonly _subscriptions: Subscriptions = new Subscriptions();
  private readonly _navigated: Subject<NavigationEnd> = new Subject();
  private readonly _history: NavigationTarget[] = [];
  private readonly _container: NavigationTarget[] = [];
  private readonly _active: NavigationTarget[] = [];

  get navigated$(): Observable<NavigationEnd> { return this._navigated.asObservable(); }

  constructor(private route: ActivatedRoute, private router: Router) {
    this._subscriptions.subscribe(this.router.events.pipe(guard(isInstanceOf(NavigationEnd)), tap(event => {
      this.handleNavigation();
      this._navigated.next(event);
    })));
  }

  private isSameContainer(segments: NavigationTarget[]): boolean {
    return this._container.length <= 2 || segments.length <= 2 && segments.length <= this._container.length;
  }

  private getLastSegmentIndex(segment: NavigationTarget | undefined) {
    if (segment) {
      for (let i = this._history.length - 1; i >= 0; i--) {
        if (this._history[i].isMatch(segment)) {
          return i;
        }
      }
    }
    return -1;
  }

  private getContainedChain(): NavigationTarget[] {
    if (this._container.length > 0) {
      const segment = this._container[this._container.length - 1];
      const index = this.getLastSegmentIndex(segment);
      if (index >= 0) {
        return this._history.slice(index + 1);
      }
    }
    return [];
  }

  private handleNavigation(): void {
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
        this._history.push(segment);
      } else {
        this._history.splice(index + 1);
      }
    }
    if (this.isSameContainer(segments)) {
      this._container.splice(0, this._container.length, ...segments);
    }
    this._active.splice(0, this._active.length, ...segments);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getContainedHistory(): NavigationTarget[] {
    return this._container.concat(this.getContainedChain());
  }

  navigateBack(): void {
    this._history.pop();
    if (this._history.length > 0) {
      const segment = this._history[this._history.length - 1];
      this.router.navigate(['/'].concat(segment.path), { replaceUrl: true });
    }
  }
}
