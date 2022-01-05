import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ContentStateService, WeatherForecast } from 'src/app/modules/backend/backend.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public constructor(private state: ContentStateService) {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }
}
