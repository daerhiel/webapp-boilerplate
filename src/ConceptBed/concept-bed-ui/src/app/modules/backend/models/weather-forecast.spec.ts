import { getEqualityTester } from '@app/spec/helpers';
import { weatherId1, weatherId2, weathers } from '@modules/backend/content-api.service.spec';
import { WeatherForecast } from './weather-forecast';

describe('WeatherForecast', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(getEqualityTester(WeatherForecast));
  });

  it('should create', () => {
    const actual = new WeatherForecast();

    expect(actual).toEqual({} as any);
  });

  it('should create from empty object', () => {
    const actual = new WeatherForecast({});

    expect(actual).toEqual({} as any);
  });

  it('should create from object', () => {
    const weather = weathers.elements.find(x => x.id === weatherId2)
    const actual = new WeatherForecast(weather);

    expect(actual).toEqual(weather as any);
  });

  it('should update', () => {
    const weather1 = weathers.elements.find(x => x.id === weatherId1)
    const weather2 = weathers.elements.find(x => x.id === weatherId2)
    const actual = new WeatherForecast(weather2);

    actual.update(weather1)

    expect(actual).toEqual(weather1 as any);
  });
});
