import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { contentApiMock, contentApiMockFailure, failure, weatherId2, weathers } from '@modules/backend/content-api.service.spec';
import { BroadcastService, MessageType } from '@modules/services/services.module';
import { ContentStateService } from './content-state.service';
import { convert, ODataResultSet } from './structure/odata-result-set';
import { ProblemDetails } from './structure/problem-details';
import { WeatherForecast } from './models/weather-forecast';
import { WeatherForecastApi } from './models/weather-forecast-api';

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

  it('should create', inject([ContentStateService], async (state: ContentStateService) => {
    expect(state).toBeTruthy();
  }));

  it('should request weather object', inject([ContentStateService], async (state: ContentStateService) => {
    const weather = weathers.elements.find(x => x.id === weatherId2)!;

    const promise = firstValueFrom(state.getWeather(weatherId2));
    contentApiMock(controller, weather, 'weatherforecast', [weatherId2]);

    const actual = await promise;
    expect(actual).toBeInstanceOf(WeatherForecast);
    expect(actual).toEqual(new WeatherForecast(weather));
  }));

  it('should get error on request weather object failure', inject([ContentStateService], async (state: ContentStateService) => {
    const promise = firstValueFrom(state.getWeather(weatherId2), { defaultValue: undefined });
    contentApiMockFailure(controller, 'weatherforecast', [weatherId2]);

    const actual = await promise;
    expect(actual).toBeInstanceOf(ProblemDetails);
    expect(actual).toEqual(new ProblemDetails(failure));
  }));

  it('should broadcast on request weather object failure', inject([ContentStateService, BroadcastService], async (state: ContentStateService, broadcast: BroadcastService) => {
    const notify = firstValueFrom(broadcast.messages);

    const promise = firstValueFrom(state.getWeather(weatherId2), { defaultValue: undefined });
    contentApiMockFailure(controller, 'weatherforecast', [weatherId2]);

    const message = await notify;
    expect(message.type).toEqual(MessageType.Error);

    await promise;
  }));

  it('should request weather object', inject([ContentStateService], async (state: ContentStateService) => {
    const promise = firstValueFrom(state.getWeatherForecast({}));
    contentApiMock(controller, weathers, 'weatherforecast');

    const actual = await promise as ODataResultSet<WeatherForecast>;
    expect(actual).toEqual(convert<WeatherForecastApi, WeatherForecast>(weathers, x => new WeatherForecast(x)));
  }));

  it('should get error on request weather object failure', inject([ContentStateService], async (state: ContentStateService) => {
    const promise = firstValueFrom(state.getWeatherForecast({}), { defaultValue: undefined });
    contentApiMockFailure(controller, 'weatherforecast');

    const actual = await promise;
    expect(actual).toBeInstanceOf(ProblemDetails);
    expect(actual).toEqual(new ProblemDetails(failure));
  }));

  it('should broadcast on request weather object failure', inject([ContentStateService, BroadcastService], async (state: ContentStateService, broadcast: BroadcastService) => {
    const notify = firstValueFrom(broadcast.messages);

    const promise = firstValueFrom(state.getWeatherForecast({}), { defaultValue: undefined });
    contentApiMockFailure(controller, 'weatherforecast');

    const message = await notify;
    expect(message.type).toEqual(MessageType.Error);

    await promise;
  }));
});
