import { ErrorHandler, Injectable, OnDestroy } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Subscription } from 'rxjs';

import { TelemetryService } from './telemetry.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  constructor(private telemetry: TelemetryService) {
    super();
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  override handleError(error: Error): void {
    super.handleError(error);
    this.telemetry.logException({ error, severityLevel: SeverityLevel.Error });
  }
}
