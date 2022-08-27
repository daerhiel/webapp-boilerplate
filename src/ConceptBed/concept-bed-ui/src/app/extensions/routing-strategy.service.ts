import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, Route, RouteReuseStrategy } from '@angular/router';
import { isPersistent } from '@app/modules/services/models/persistent';

/**
 * The routing strategy to reuse the master/detail components implemented per guide:
 * https://javascript.plainenglish.io/angular-route-reuse-strategy-b5d40adce841
 */
@Injectable({
  providedIn: 'root'
})
export class RoutingStrategyService extends RouteReuseStrategy {
  private readonly routes: Map<Route, DetachedRouteHandle> = new Map();

  /** Determines if this route (and its subtree) should be reattached. */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && this.routes.has(route.routeConfig);
  }

  /** Determines if this route (and its subtree) should be detached to be reused later. */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && isPersistent(route.component);
  }

  /** Determines if a route should be reused. */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /** Stores the detached route. Storing a `null` value should erase the previously stored value. */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (route.routeConfig) {
      if (handle) {
        this.routes.set(route.routeConfig, handle);
      } else {
        this.routes.delete(route.routeConfig);
      }
    }
  }

  /** Retrieves the previously stored route. */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.routeConfig) {
      return this.routes.get(route.routeConfig) ?? null;
    } else {
      return null;
    }
  }
}
