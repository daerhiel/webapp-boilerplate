import { Injectable } from '@angular/core';
import { ApplicationInsights, DistributedTracingModes, IEventTelemetry, IExceptionTelemetry, IMetricTelemetry, IPageViewTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        disableFetchTracking: false,
        disableCorrelationHeaders: false,
        correlationHeaderExcludedDomains: ['myapp.azurewebsites.net', '*.queue.core.windows.net'],
        distributedTracingMode: DistributedTracingModes.W3C
      }
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(telemetry: IPageViewTelemetry): void {
    this.appInsights.trackPageView(telemetry);
  }

  logEvent(telemetry: IEventTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackEvent(telemetry, properties);
  }

  logMetric(telemetry: IMetricTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackMetric(telemetry, properties);
  }

  logException(telemetry: IExceptionTelemetry): void {
    this.appInsights.trackException(telemetry);
  }

  logTrace(telemetry: ITraceTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackTrace(telemetry, properties);
  }
}
