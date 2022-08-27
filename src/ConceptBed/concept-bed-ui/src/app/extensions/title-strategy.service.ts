import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

/**
 * The title strategy to update the application title based on navigation events according to the guide:
 * https://dev.to/brandontroberts/setting-page-titles-natively-with-the-angular-router-393j
 */
@Injectable({
  providedIn: 'any'
})
export class TitleStrategyService extends TitleStrategy {
  static title = 'Concept Bed';

  constructor(private readonly title$: Title) {
    super();
  }

  /** Performs the application title update. */
  updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.title$.setTitle(`${TitleStrategyService.title} - ${title}`);
    } else {
      this.title$.setTitle(`${TitleStrategyService.title}`);
    }
  }
}
