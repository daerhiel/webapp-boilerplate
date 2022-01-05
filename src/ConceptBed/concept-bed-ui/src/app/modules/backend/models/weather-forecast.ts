import { DataUtilities } from "../structure/data-utilities";
import { DeepPartial } from "../structure/deep-partial";
import { WeatherForecastApi } from "./weather-forecast-api";

export class WeatherForecast implements WeatherForecastApi {
  public id!: string;
  public date!: Date;
  public temperature!: number;
  public summary!: string;
  public state!: number;

  public constructor(values: DeepPartial<WeatherForecastApi> = {}) {
    this.update(values);
  }

  public static buildQuery(term: string | undefined): string | undefined {
    if (!!term) {
      term = `contains(summary,'${term}')`;
    }
    return term;
  }

  public update(values?: DeepPartial<WeatherForecastApi>): void {
    if (!!values) {
      Object.assign<WeatherForecast, DeepPartial<WeatherForecastApi>>(this, values);
      this.date = DataUtilities.of(values.date);
    }
  }
}
