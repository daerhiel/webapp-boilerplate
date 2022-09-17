import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import * as uuid from 'uuid';

import { environment } from '@environments/environment';
import { ContentApiService } from './content-api.service';
import { DeepPartial } from './structure/deep-partial';
import { ODataQuery } from './structure/odata-query';
import { ODataResultSet } from './backend.module';
import { buildUrl, UrlParams } from './structure/url-utilities';
import { WeatherForecastApi } from './models/weather-forecast-api';
import { ProblemDetailsApi } from './structure/problem-details-api';

export const weatherId1 = uuid.v4();
export const weatherId2 = uuid.v4();
export const weatherId3 = uuid.v4();
export const weathers: ODataResultSet<WeatherForecastApi> = {
  offset: 0,
  count: 3,
  elements: [{
    id: weatherId1,
    date: new Date('2022-02-15T20:16:04.6253229Z'),
    temperature: -18,
    summary: 'Bracing',
    history: [],
    status: 0
  },
  {
    id: weatherId2,
    date: new Date('2022-02-12T20:16:04.6253197Z'),
    temperature: -7,
    summary: 'Mild',
    history: [],
    status: 0
  },
  {
    id: weatherId3,
    date: new Date('2022-02-20T20:16:04.6253239Z'),
    temperature: 33,
    summary: 'Cool',
    history: [],
    status: 0
  }]
};

export const failure: DeepPartial<ProblemDetailsApi> = {
  type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  title: "An error occurred while processing your request.",
  status: 400,
  exception: {
    message: "The error occurred.",
    category: "InvalidOperationException",
  }
};

export function contentApiMock(controller: HttpTestingController, result: any, root: string, actions?: string[], query?: UrlParams): void {
  const request = controller.expectOne(buildUrl(environment.apiUrl, root, actions, query));
  expect(request.request.method).toEqual('GET');
  request.flush(result);
}

describe('ContentApiService', () => {
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create an instance', inject([ContentApiService], async (api: ContentApiService) => {
    expect(api).toBeTruthy();
  }));

  it('should request weather object', inject([ContentApiService], async (api: ContentApiService) => {
    const weather = weathers.elements.find(x => x.id === weatherId2)!;

    const promise = firstValueFrom(api.getWeather(weatherId2));
    contentApiMock(controller, weather, 'weatherforecast', [weatherId2]);

    const actual = await promise;
    expect(actual).toEqual(weather);
  }));

  it('should request weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const promise = firstValueFrom(api.getWeatherForecast({}));
    contentApiMock(controller, weathers, 'weatherforecast', []);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request filtered weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $filter: 'summary=\'Bracing\''
    };

    const promise = firstValueFrom(api.getWeatherForecast(query));
    contentApiMock(controller, weathers, 'weatherforecast', [], query);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request expanded weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $expand: 'history'
    };

    const promise = firstValueFrom(api.getWeatherForecast(query));
    contentApiMock(controller, weathers, 'weatherforecast', [], query);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request ordered weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $orderby: 'temperature'
    };

    const promise = firstValueFrom(api.getWeatherForecast(query));
    contentApiMock(controller, weathers, 'weatherforecast', [], query);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));

  it('should request paged weather object collection', inject([ContentApiService], async (api: ContentApiService) => {
    const query: ODataQuery<WeatherForecastApi> = {
      $top: 10,
      $skip: 10
    };

    const promise = firstValueFrom(api.getWeatherForecast(query));
    contentApiMock(controller, weathers, 'weatherforecast', [], query);

    const actual = await promise;
    expect(actual).toEqual(weathers);
  }));
});
