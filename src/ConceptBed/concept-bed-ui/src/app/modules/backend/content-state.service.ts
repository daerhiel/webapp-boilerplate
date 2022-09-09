import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BroadcastService } from '@modules/services/broadcast.service';
import { ContentApiService } from './content-api.service';
import { convert, ODataResultSet } from './structure/odata-result-set';
import { ODataQuery } from './structure/odata-query';
import { WeatherForecast } from './models/weather-forecast';
import { WeatherForecastApi } from './models/weather-forecast-api';
import { ProblemDetailsApi } from './structure/problem-details-api';
import { ProblemDetails } from './structure/problem-details';

@Injectable({
  providedIn: 'root'
})
export class ContentStateService {
  isWeatherBusy: boolean = false;

  constructor(private api: ContentApiService, private broadcast: BroadcastService) {
  }

  private handleError = (e: HttpErrorResponse): Observable<ProblemDetails> => {
    this.broadcast.excepion(e);
    return of(new ProblemDetails(e.error as ProblemDetailsApi));
  }

  getWeather(id: string): Observable<WeatherForecast | ProblemDetails> {
    return this.api.getWeather(id).pipe(
      map(x => new WeatherForecast(x)),
      catchError(this.handleError)
    );
  }

  getWeatherForecast(query: ODataQuery<WeatherForecastApi>): Observable<ODataResultSet<WeatherForecast> | ProblemDetails> {
    return this.api.getWeatherForecast(query).pipe(
      map(xs => convert(xs, x => new WeatherForecast(x))),
      catchError(this.handleError)
    );
  }
}
