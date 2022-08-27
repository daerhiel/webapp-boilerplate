import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, tap } from 'rxjs';

import { Subscriptions } from './models/subscriptions';
import { getPath, NavigationTarget } from './models/navigation-target';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly navigated$: Subject<NavigationEnd> = new Subject();
  private readonly history: NavigationTarget[] = [];
  private readonly container: NavigationTarget[] = [];
  private readonly active: NavigationTarget[] = [];

  get navigated(): Observable<NavigationEnd> { return this.navigated$.asObservable(); }

  constructor(private route: ActivatedRoute, private router: Router) {
    this.subscriptions.subscribe(this.router.events.pipe(tap(event => {
      if (event instanceof NavigationEnd) {
        this.handleNavigation();
        this.navigated$.next(event);
      }
    })));
  }

  private isSameContainer(segments: NavigationTarget[]): boolean {
    return this.container.length <= 2 || segments.length <= 2 && segments.length <= this.container.length;
  }

  private getLastSegmentIndex(segment: NavigationTarget | undefined) {
    if (segment) {
      for (let i = this.history.length - 1; i >= 0; i--) {
        if (this.history[i].isMatch(segment)) {
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
        return this.history.slice(index + 1);
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
        this.history.push(segment);
      } else {
        this.history.splice(index + 1);
      }
    }
    if (this.isSameContainer(segments)) {
      this.container.splice(0, this.container.length, ...segments);
    }
    this.active.splice(0, this.active.length, ...segments);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getContainedHistory(): NavigationTarget[] {
    return this.container.concat(this.getContainedChain());
  }

  navigateBack(): void {
    this.history.pop();
    if (this.history.length > 0) {
      const segment = this.history[this.history.length - 1];
      this.router.navigate(['/'].concat(segment.path), { replaceUrl: true });
    }
  }
}
