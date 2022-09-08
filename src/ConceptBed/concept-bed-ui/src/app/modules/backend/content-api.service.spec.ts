import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { ContentApiService } from './content-api.service';
import { WeatherForecastApi } from './models/weather-forecast-api';
import { UrlUtilities } from './structure/url-utilities';
import { ODataQuery } from './structure/odata-query';

describe('ContentApiService', () => {
  let controller: HttpTestingController;
  const weatherId = '00d2ecb6-ea0b-4d73-a087-a30a2d580150';
  const weathers = {
    offset: 0,
    count: 50,
    elements: [{
      id: '00d2ecb6-ea0b-4d73-a087-a30a2d580150',
      date: '2022-02-15T20:16:04.6253229Z',
      temperature: -18,
      summary: 'Bracing',
      history: [],
      status: 0
    },
    {
      id: '03168dd9-83e4-4f53-b781-a8c8dbdc6e16',
      date: '2022-02-12T20:16:04.6253197Z',
      temperature: -7,
      summary: 'Mild',
      history: [],
      status: 0
    },
    {
      id: '0e774bcb-05f5-4eed-9d9d-883947c34442',
      date: '2022-02-20T20:16:04.6253239Z',
      temperature: 33,
      summary: 'Cool',
      history: [],
      status: 0
    }]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', inject([ContentApiService], async (api: ContentApiService) => {
    expect(api).toBeTruthy();
  }));

  it('should request weather object', inject([ContentApiService], async (api: ContentApiService) => {
    const promise = lastValueFrom(api.getWeather(weatherId));
    const weather = weathers.elements.find(x => x.id === weatherId)!;

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [weatherId]));
    expect(request.request.method).toEqual('GET');
    request.flush(weather);

    const actual = await promise;
    expect(actual).toEqual(weather);
  }));

  it('should request weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const promise = lastValueFrom(api.getWeatherForecast({}));

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', []));
    expect(request.request.method).toEqual('GET');
    request.flush(weathers);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request filtered weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $filter: 'summary=\'Bracing\''
    };
    const promise = lastValueFrom(api.getWeatherForecast(query));

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [], query));
    expect(request.request.method).toEqual('GET');
    request.flush(weathers);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request expanded weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $expand: 'history'
    };
    const promise = lastValueFrom(api.getWeatherForecast(query));

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [], query));
    expect(request.request.method).toEqual('GET');
    request.flush(weathers);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request ordered weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $orderby: 'temperature'
    };
    const promise = lastValueFrom(api.getWeatherForecast(query));

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [], query));
    expect(request.request.method).toEqual('GET');
    request.flush(weathers);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request paged weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $skip: 10,
      $top: 10
    };
    const promise = lastValueFrom(api.getWeatherForecast(query));

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [], query));
    expect(request.request.method).toEqual('GET');
    request.flush(weathers);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));
});
