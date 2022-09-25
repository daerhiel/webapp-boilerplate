import { Injectable, OnDestroy } from '@angular/core';

import { guard } from '@modules/services/services.module';
import { ContentStateService, isResult, ODataSource, WeatherForecast } from '@modules/backend/backend.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnDestroy {
  readonly data: ODataSource<WeatherForecast> = new ODataSource(x => this.state.getWeatherForecast(x).pipe(
    guard(isResult),
  ), x => WeatherForecast.buildQuery(x));

  constructor(private state: ContentStateService) {
  }

  ngOnDestroy(): void {
    this.data.complete();
  }
}
