import { WeatherLogEntryApi } from "./weather-log-entry-api";

export interface WeatherForecastApi {
  id: string;
  date: Date;
  temperature: number;
  summary: string;
  history?: WeatherLogEntryApi[] | null;
  state: number;
}
