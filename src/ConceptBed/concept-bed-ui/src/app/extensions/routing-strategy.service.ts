import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Subscription } from 'rxjs';

import { DashboardComponent } from '../modules/features/dashboard/dashboard.module';

/**
 * The routing strategy to reuse the master/detail components implemented per guide:
 * https://javascript.plainenglish.io/angular-route-reuse-strategy-b5d40adce841
 */
@Injectable({
  providedIn: 'root'
})
export class RoutingStrategyService extends RouteReuseStrategy implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private readonly routes: Map<string | undefined, DetachedRouteHandle | null> = new Map();

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    this.routes.set(route.routeConfig?.path, handle);
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.routes.get(route.routeConfig?.path) ?? null;
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    switch (route.component && (route.component as any).name) {
      // case DashboardComponent.name:
      //   return true;
      default:
        return false;
    }
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.routes.get(route.routeConfig.path);
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
