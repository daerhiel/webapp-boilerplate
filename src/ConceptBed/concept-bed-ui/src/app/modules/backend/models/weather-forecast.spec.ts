import { getEqualityTester } from '@app/spec/helpers';
import { weatherId1, weatherId2, weathers } from '@modules/backend/content-api.service.spec';
import { WeatherForecast } from './weather-forecast';

describe('WeatherForecast', () => {

  beforeEach(() => {
    jasmine.addCustomEqualityTester(getEqualityTester(WeatherForecast));
  });

  it('should create a default instance', () => {
    const actual = new WeatherForecast();

    expect(actual).toEqual({} as any);
  });

  it('should create an empty instance', () => {
    const actual = new WeatherForecast({});

    expect(actual).toEqual({} as any);
  });

  it('should create an instance', () => {
    const weather = weathers.elements.find(x => x.id === weatherId2)
    const actual = new WeatherForecast(weather);

    expect(actual).toEqual(weather as any);
  });

  it('should update an instance', () => {
    const weather1 = weathers.elements.find(x => x.id === weatherId1)
    const weather2 = weathers.elements.find(x => x.id === weatherId2)
    const actual = new WeatherForecast(weather2);

    actual.update(weather1)

    expect(actual).toEqual(weather1 as any);
  });
});
