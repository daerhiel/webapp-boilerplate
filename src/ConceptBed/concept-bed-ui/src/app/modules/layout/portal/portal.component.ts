import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Subscriptions } from '@modules/services/services.module';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortalComponent implements OnDestroy {
  private readonly _subscriptions: Subscriptions = new Subscriptions();
  private readonly _routeLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private routeLoading: number = 0;

  isRouteLoading: boolean = false;

  get isRouteLoading$(): Observable<boolean> { return this._routeLoading.asObservable(); }

  constructor(private router: Router) {
    this._subscriptions.subscribe(this.router.events.pipe(tap(event => {
      if (event instanceof RouteConfigLoadStart) {
        if (++this.routeLoading === 1) {
          this._routeLoading.next(this.isRouteLoading = true);
        }
      } else if (event instanceof RouteConfigLoadEnd) {
        if (this.routeLoading-- === 1) {
          this._routeLoading.next(this.isRouteLoading = false);
        }
      }
    })));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._routeLoading.complete();
  }
}
