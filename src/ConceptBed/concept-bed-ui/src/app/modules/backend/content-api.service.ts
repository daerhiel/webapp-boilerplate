import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { DeepPartial } from './structure/deep-partial';
import { ODataResultSet } from './structure/odata-result-set';
import { ODataQuery } from './structure/odata-query';
import { UrlUtilities } from './structure/url-utilities';
import { WeatherForecastApi } from './models/weather-forecast-api';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getWeather(id: string): Observable<DeepPartial<WeatherForecastApi>> {
    return this.http.get<WeatherForecastApi>(UrlUtilities.buildUrl(this.apiUrl, 'weatherforecast', [id]), { withCredentials: true })
  }

  getWeatherForecast(query: ODataQuery<WeatherForecastApi>): Observable<ODataResultSet<DeepPartial<WeatherForecastApi>>> {
    return this.http.get<ODataResultSet<DeepPartial<WeatherForecastApi>>>(UrlUtilities.buildUrl(this.apiUrl, 'weatherforecast', [], query), { withCredentials: true })
  }
}
