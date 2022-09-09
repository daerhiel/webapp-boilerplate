import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';

import { ContentStateService } from './content-state.service';
import { UrlUtilities } from './structure/url-utilities';
import { environment } from '@environments/environment';

import { weatherId, weathers } from './content-api.service.spec';
import { BroadcastService } from '../services/broadcast.service';
import { WeatherForecast } from './models/weather-forecast';

describe('ContentStateService', () => {
  let controller: HttpTestingController;

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

  it('should be created', inject([ContentStateService], async (state: ContentStateService) => {
    expect(state).toBeTruthy();
  }));

  it('should request weather object', inject([ContentStateService], async (state: ContentStateService) => {
    const promise = lastValueFrom(state.getWeather(weatherId));
    const weather = weathers.elements.find(x => x.id === weatherId)!;

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [weatherId]));
    expect(request.request.method).toEqual('GET');
    request.flush(weather);

    const actual = await promise;
    expect(actual).toBeInstanceOf(WeatherForecast);
    expect(actual).toEqual(new WeatherForecast(weather));
  }));

  it('should broadcast on request weather object failure', inject([ContentStateService, BroadcastService], async (state: ContentStateService, broadcast: BroadcastService) => {
    const promise = lastValueFrom(state.getWeather(weatherId), { defaultValue: undefined });
    const weather = weathers.elements.find(x => x.id === weatherId)!;

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.apiUrl, 'weatherforecast', [weatherId]));
    expect(request.request.method).toEqual('GET');
    request.flush(weather, { status: 400, statusText: 'test' });

    const actual = await promise;
    expect(actual).toBeInstanceOf(WeatherForecast);
    expect(actual).toEqual(new WeatherForecast(weather));
  }));
});
