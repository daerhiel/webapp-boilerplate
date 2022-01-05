import { ErrorHandler, Injectable, OnDestroy } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Subscription } from 'rxjs';

import { TelemetryService } from './telemetry.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public constructor(private telemetry: TelemetryService) {
    super();
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public override handleError(error: Error): void {
    super.handleError(error);
    this.telemetry.logException({ error, severityLevel: SeverityLevel.Error });
  }
}
