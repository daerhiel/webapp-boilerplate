import { Injectable, OnDestroy } from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { ContentApiService } from './content-api.service';

import { BroadcastService } from 'src/app/modules/services/broadcast.service';
import { convert, create, ODataResultSet } from './structure/odata-result-set';
import { ODataQuery } from './structure/odata-query';
import { WeatherForecast } from './models/weather-forecast';

@Injectable({
  providedIn: 'root'
})
export class ContentStateService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public isWeatherBusy: boolean = false;

  public constructor(private api: ContentApiService, private broadcast: BroadcastService) {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public getWeather(id: string): Observable<WeatherForecast> {
    return this.api.getWeather(id).pipe(
      map(x => new WeatherForecast(x)),
      catchError(e => (this.broadcast.excepion(e), of()))
    );
  }

  public getWeatherForecast(query: ODataQuery): Observable<ODataResultSet<WeatherForecast>> {
    return this.api.getWeatherForecast(query).pipe(
      map(xs => convert(xs, x => new WeatherForecast(x))),
      catchError(e => (this.broadcast.excepion(e), of(create<WeatherForecast>())))
    );
  }
}
