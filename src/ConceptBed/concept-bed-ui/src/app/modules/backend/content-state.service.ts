import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ContentApiService } from './content-api.service';

import { BroadcastService } from '@modules/services/broadcast.service';
import { convert, create, ODataResultSet } from './structure/odata-result-set';
import { ODataQuery } from './structure/odata-query';
import { WeatherForecast } from './models/weather-forecast';
import { WeatherForecastApi } from './models/weather-forecast-api';

@Injectable({
  providedIn: 'root'
})
export class ContentStateService {
  isWeatherBusy: boolean = false;

  constructor(private api: ContentApiService, private broadcast: BroadcastService) {
  }

  getWeather(id: string): Observable<WeatherForecast> {
    return this.api.getWeather(id).pipe(
      map(x => new WeatherForecast(x)),
      catchError(e => (this.broadcast.excepion(e), of()))
    );
  }

  getWeatherForecast(query: ODataQuery<WeatherForecastApi>): Observable<ODataResultSet<WeatherForecast>> {
    return this.api.getWeatherForecast(query).pipe(
      map(xs => convert(xs, x => new WeatherForecast(x))),
      catchError(e => (this.broadcast.excepion(e), of(create<WeatherForecast>())))
    );
  }
}
