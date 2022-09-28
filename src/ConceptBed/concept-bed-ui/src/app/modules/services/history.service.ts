import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { guard, isInstanceOf } from './reactive/guard';
import { Subscriptions } from './models/subscriptions';
import { getPath, NavigationTarget } from './models/navigation-target';
import { isContainer } from './models/container';

/**
 * The history tracking service that tracks the Angular route changes. the following parameters are being tracked:
 * The @property segment should receive the currently navigated segment.
 * The @property activated should receive the sequence of currently activated segments.
 * The @property container should receive the latest conainer segment.
 * The @property breadcrumbs should receive the route track from container segment to the currently navigated segment.
 */
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

  /**
   * Initializes the history tracking service.
   * @param route Provides access to information about a route associated with a component that is loaded in an outlet.
   * @param router A service that provides navigation among views and URL manipulation capabilities.
   */
  constructor(private route: ActivatedRoute, private router: Router) {
    this._subscriptions.subscribe(this.router.events.pipe(guard(isInstanceOf(NavigationEnd)), tap(event => {
      this.handleNavigation(event);
    })));
  }

  /**
   * Gets the activated container sequence that should replace the current one.
   * @param segments The list of acivated navigations from the root.
   * @returns The winning activated container sequence determined; otherwise, null.
   */
  private getWinningContainer(segments: NavigationTarget[]): NavigationTarget[] | null {
    if (segments.length > 0) {
      let isMatching = true, index = -1;
      for (let i = 0; i < segments.length; i++) {
        if (isMatching) {
          if (i < this.container.length) {
            isMatching = this.container[i].isMatch(segments[i]);
          } else if (this.container.length > 0) {
            break;
          } else {
            isMatching = false;
          }
        }
        if (isContainer(segments[i].component)) {
          index = i;
        }
      }
      if (!isMatching) {
        return segments.slice(0, ++index);
      }
    }
    return null;
  }

  /**
   * Gets the breadcrumb navigation history starting with the currently activated container sequence.
   * @returns The breadcrumb navigation history determined.
   */
  private getContainerHistory(): NavigationTarget[] {
    const segments: NavigationTarget[] = [...this.container];
    const container: NavigationTarget | undefined = segments[segments.length - 1];
    if (container) {
      for (let i = this._navigations.length - 1; i >= 0; i--) {
        if (this._navigations[i].isMatch(container)) {
          segments.push(...this._navigations.slice(i + 1));
          break;
        }
      }
    } else if (this.segment) {
      segments.push(this.segment);
    }
    return segments;
  }

  /**
   * Handles the navigation event r eceived from the router and submits the respective navigation state changes.
   * @param event The navigation event indicating the navigation is ended.
   */
  private handleNavigation(event: NavigationEnd): void {
    let current: ActivatedRoute | undefined = this.route;

    /**
     * The @const segments should contain the list of currently activated nested segment sequence bound to components.
     * The @var segment should be the topmost segment in that sequence.
     */
    let segment: NavigationTarget | undefined;
    const segments: NavigationTarget[] = [];
    do {
      if (current.outlet === 'primary' && current.routeConfig && current.snapshot) {
        segment = segments.find(x => x.isMatch(getPath(current!.snapshot.pathFromRoot)));
        if (segment) {
          segment.update(current.snapshot);
        } else {
          segments.push(segment = new NavigationTarget(current.snapshot));
        }
      }
      current = current.children.find(x => x.outlet === 'primary');
    } while (current);

    /**
     * Push updated changes to data streams:
     * The @field _segment should receive the currently navigated segment.
     * The @field _activated should receive the sequence of currently activated segments.
     * The @field _container should receive the latest conainer segment.
     * The @field _breadcrumbs should receive the route track from container segment to the currently navigated segment.
     */
    this._segment.next(segment ?? null)
    this._activated.next(segments);
    const container = this.getWinningContainer(segments);
    if (container) {
      this._container.next(container);
    }
    if (segment) {
      this._navigations.push(segment);
    }
    this._breadcrumbs.next(this.getContainerHistory());
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  /**
   * Navigates to the previously navigated segment in history.
   */
  navigateBack(): Promise<boolean> {
    if (this._navigations.pop()) {
      const segment = this._navigations.pop();
      if (segment) {
        return this.router.navigate(segment.path, { replaceUrl: true });
      }
    }
    return Promise.resolve(false);
  }
}
