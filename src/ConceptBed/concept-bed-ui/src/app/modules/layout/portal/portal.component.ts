import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public isRouteLoading: boolean = false;

  public constructor(private router: Router) {
    this.subscriptions.push(this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isRouteLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isRouteLoading = false;
      }
    }))
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }
}
