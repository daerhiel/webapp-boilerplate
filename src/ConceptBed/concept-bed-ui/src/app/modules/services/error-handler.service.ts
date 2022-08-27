import { ErrorHandler, Injectable } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { TelemetryService } from './telemetry.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(private telemetry: TelemetryService) {
    super();
  }

  public override handleError(error: Error): void {
    this.telemetry.logException({ error, severityLevel: SeverityLevel.Error });
    super.handleError(error);
  }
}
