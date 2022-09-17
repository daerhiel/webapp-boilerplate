import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { failure, weatherId2, weathers } from '@modules/backend/content-api.service.spec';
import { environment } from '@environments/environment';
import { BroadcastService, MessageType } from '@modules/services/services.module';
import { ContentStateService } from './content-state.service';
import { buildUrl } from './structure/url-utilities';
import { ProblemDetails } from './structure/problem-details';
import { WeatherForecast } from './models/weather-forecast';

describe('ContentStateService', () => {
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

  it('should create an instance', inject([ContentStateService], async (state: ContentStateService) => {
    expect(state).toBeTruthy();
  }));

  it('should request weather object', inject([ContentStateService], async (state: ContentStateService) => {
    const weather = weathers.elements.find(x => x.id === weatherId2)!;

    const promise = firstValueFrom(state.getWeather(weatherId2));
    const request = controller.expectOne(buildUrl(environment.apiUrl, 'weatherforecast', [weatherId2]));
    expect(request.request.method).toEqual('GET');
    request.flush(weather);

    const actual = await promise;
    expect(actual).toBeInstanceOf(WeatherForecast);
    expect(actual).toEqual(new WeatherForecast(weather));
  }));

  it('should get error on request weather object failure', inject([ContentStateService], async (state: ContentStateService) => {
    const promise = firstValueFrom(state.getWeather(weatherId2), { defaultValue: undefined });
    const request = controller.expectOne(buildUrl(environment.apiUrl, 'weatherforecast', [weatherId2]));
    expect(request.request.method).toEqual('GET');
    request.flush(failure, { status: failure.status, statusText: failure.title });

    const actual = await promise;
    expect(actual).toBeInstanceOf(ProblemDetails);
    expect(actual).toEqual(new ProblemDetails(failure));
  }));

  it('should broadcast on request weather object failure', inject([ContentStateService, BroadcastService], async (state: ContentStateService, broadcast: BroadcastService) => {
    const notify = firstValueFrom(broadcast.messages);

    const promise = firstValueFrom(state.getWeather(weatherId2), { defaultValue: undefined });
    const request = controller.expectOne(buildUrl(environment.apiUrl, 'weatherforecast', [weatherId2]));
    expect(request.request.method).toEqual('GET');
    request.flush(failure, { status: failure.status, statusText: failure.title });

    const message = await notify;
    expect(message.type).toEqual(MessageType.Error);

    await promise;
  }));
});
