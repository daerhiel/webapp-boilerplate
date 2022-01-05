import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { DeepPartial } from './structure/deep-partial';
import { ODataQuery } from './structure/odata-query';
import { ODataResultSet } from './structure/odata-result-set';
import { UrlUtilities } from './structure/url-utilities';
import { WeatherForecastApi } from './models/weather-forecast-api';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private readonly apiUrl: string = environment.apiUrl;

  public constructor(private http: HttpClient) {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public getWeather(id: string): Observable<DeepPartial<WeatherForecastApi>> {
    return this.http.get<WeatherForecastApi>(UrlUtilities.buildUrl(this.apiUrl, 'weatherforecast', [id]), { withCredentials: true })
  }

  public getWeatherForecast(query: ODataQuery): Observable<ODataResultSet<DeepPartial<WeatherForecastApi>>> {
    return this.http.get<ODataResultSet<DeepPartial<WeatherForecastApi>>>(UrlUtilities.buildUrl(this.apiUrl, 'weatherforecast', [], query), { withCredentials: true })
  }
}
