import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-sidenav-actions',
  templateUrl: './sidenav-actions.component.html',
  styleUrls: ['./sidenav-actions.component.scss']
})
export class SidenavActionsComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public constructor(public dashboard: DashboardService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }
}