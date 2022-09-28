import { Component, OnDestroy } from '@angular/core';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';

import { WeatherForecast } from '@modules/backend/backend.module';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-weather-actions',
  templateUrl: './weather-actions.component.html',
  styleUrls: ['./weather-actions.component.scss']
})
export class WeatherActionsComponent implements CollectionViewer, OnDestroy {
  readonly viewChange: Subject<ListRange> = new Subject();
  data$: Observable<WeatherForecast[]>;

  constructor(private dashboard: DashboardService) {
    this.data$ = this.dashboard.data.connect(this);
  }

  ngOnDestroy(): void {
    this.dashboard.data.disconnect(this);
  }
}
