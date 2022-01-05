import { Injectable, OnDestroy } from '@angular/core';
import { ApplicationInsights, DistributedTracingModes, IEventTelemetry, IExceptionTelemetry, IMetricTelemetry, IPageViewTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private appInsights: ApplicationInsights;

  public constructor() {
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

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public logPageView(telemetry: IPageViewTelemetry): void {
    this.appInsights.trackPageView(telemetry);
  }

  public logEvent(telemetry: IEventTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackEvent(telemetry, properties);
  }

  public logMetric(telemetry: IMetricTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackMetric(telemetry, properties);
  }

  public logException(telemetry: IExceptionTelemetry): void {
    this.appInsights.trackException(telemetry);
  }

  public logTrace(telemetry: ITraceTelemetry, properties?: { [key: string]: any }): void {
    this.appInsights.trackTrace(telemetry, properties);
  }
}
