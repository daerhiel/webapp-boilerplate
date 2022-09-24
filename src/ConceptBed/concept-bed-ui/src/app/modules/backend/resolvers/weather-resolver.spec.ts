import { Component } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { contentApiMock, weatherId1, weathers } from '../content-api.service.spec';
import { ContentStateService } from '../content-state.service';
import { WeatherResolver } from './weather-resolver';
import { firstValueFrom } from 'rxjs';
import { getSnapshot } from '@app/extensions/routing-strategy.service.spec';
import { WeatherForecast } from '../models/weather-forecast';

@Component({
  template: `<router-outlet></router-outlet>`
})
class RoutingComponent {
}

@Component({})
class TestComponent {
}

describe('WeatherResolver', () => {
  let fixture: ComponentFixture<RoutingComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{
          path: '', component: RoutingComponent, children: [
            { path: ':id', component: TestComponent, resolve: { weather: WeatherResolver } }
          ]
        }], { initialNavigation: 'enabledBlocking' })
      ],
      declarations: [
        RoutingComponent,
        TestComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create an instance', inject([WeatherResolver], (resolver: WeatherResolver) => {
    expect(resolver).toBeTruthy();
  }));

  it('should resolve by object id', inject([WeatherResolver], async (resolver: WeatherResolver) => {
    const weather = weathers.elements.find(x => x.id === weatherId1)!;

    const promise = firstValueFrom(resolver.resolve({ paramMap: convertToParamMap({ id: weatherId1 }) } as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    contentApiMock(controller, weather, 'weatherforecast', [weatherId1]);
    const actual = await promise;

    expect(actual).toBeInstanceOf(WeatherForecast);
    expect(actual).toEqual(new WeatherForecast(weather));
  }));

  it('should resolve object by id', inject([Router, ContentStateService], async (router: Router, state: ContentStateService) => {
    const weather = weathers.elements.find(x => x.id === weatherId1)!;

    const promise = router.navigate([weatherId1]);
    await fixture.whenStable();
    contentApiMock(controller, weather, 'weatherforecast', [weatherId1]);
    await promise;

    const snapshot = getSnapshot(router, TestComponent);
    expect(snapshot.data['weather']).toEqual(new WeatherForecast(weather));
  }));
});
