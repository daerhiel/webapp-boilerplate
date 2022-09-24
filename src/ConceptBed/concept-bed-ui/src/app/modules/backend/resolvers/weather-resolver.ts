import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { ContentStateService } from "../content-state.service";
import { ProblemDetails, problemDetails } from "../structure/problem-details";
import { WeatherForecast } from "../models/weather-forecast";

@Injectable({
  providedIn: 'root'
})
export class WeatherResolver implements Resolve<WeatherForecast | ProblemDetails> {
  constructor(private state: ContentStateService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WeatherForecast | ProblemDetails> {
    const id = route.paramMap.get('id');
    return id ? this.state.getWeather(id) : of(problemDetails(`The parameter is missing: '${'id'}'.`));
  }
}
