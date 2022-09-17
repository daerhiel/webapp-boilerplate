import { Injectable } from '@angular/core';
import { ApplicationInsights, DistributedTracingModes, ICustomProperties, IEventTelemetry, IExceptionTelemetry, IMetricTelemetry, IPageViewTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';

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

  logEvent(telemetry: IEventTelemetry, properties?: ICustomProperties): void {
    this.appInsights.trackEvent(telemetry, properties);
  }

  logMetric(telemetry: IMetricTelemetry, properties?: ICustomProperties): void {
    this.appInsights.trackMetric(telemetry, properties);
  }

  logException(telemetry: IExceptionTelemetry, properties?: ICustomProperties): void {
    this.appInsights.trackException(telemetry, properties);
  }

  logTrace(telemetry: ITraceTelemetry, properties?: ICustomProperties): void {
    this.appInsights.trackTrace(telemetry, properties);
  }
}
