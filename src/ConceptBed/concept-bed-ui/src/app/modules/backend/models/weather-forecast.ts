import { DeepPartial } from "../structure/deep-partial";
import { DataUtilities } from "../structure/data-utilities";
import { WeatherForecastApi } from "./weather-forecast-api";
import { WeatherLogEntryApi } from "./weather-log-entry-api";

export class WeatherForecast implements WeatherForecastApi {
  id!: string;
  date!: Date;
  temperature!: number;
  summary!: string;
  history?: WeatherLogEntryApi[] | null;
  status!: number;

  constructor(values: DeepPartial<WeatherForecastApi> = {}) {
    this.update(values);
  }

  static buildQuery(term: string | undefined): string | undefined {
    if (term) {
      term = `contains(summary,'${term}')`;
    }
    return term;
  }

  update(values?: DeepPartial<WeatherForecastApi>): void {
    if (values) {
      Object.assign<WeatherForecast, DeepPartial<WeatherForecastApi>>(this, values);
      this.date = DataUtilities.of(values.date);
    }
  }
}
