import { TestBed } from '@angular/core/testing';
import { ApplicationInsights, ICustomProperties, IEventTelemetry, IExceptionTelemetry, IMetricTelemetry, IPageViewTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';

import { TelemetryService } from './telemetry.service';

export const telemetryMock = jasmine.createSpyObj<TelemetryService>('TelemetryService', ['logException', 'logTrace']);

describe('TelemetryService', () => {
  let service: TelemetryService;
  let appInsights: ApplicationInsights;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();
    service = TestBed.inject(TelemetryService);
  });

  beforeEach(() => {
    appInsights = spyOnAllFunctions((service as any).appInsights as ApplicationInsights);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should transfer page view data', () => {
    const telemetry: IPageViewTelemetry = { name: 'Test' };
    service.logPageView(telemetry);

    expect(appInsights.trackPageView).toHaveBeenCalledWith(telemetry);
  });

  it('should transfer event data', () => {
    const telemetry: IEventTelemetry = { name: 'Test' };
    const properties: ICustomProperties = { data: 'Value' };
    service.logEvent(telemetry, properties);

    expect(appInsights.trackEvent).toHaveBeenCalledWith(telemetry, properties);
  });

  it('should transfer metric data', () => {
    const telemetry: IMetricTelemetry = { name: 'Test', average: 0 };
    const properties: ICustomProperties = { data: 'Value' };
    service.logMetric(telemetry, properties);

    expect(appInsights.trackMetric).toHaveBeenCalledWith(telemetry, properties);
  });

  it('should transfer exception data', () => {
    const telemetry: IExceptionTelemetry = { exception: new Error('Error occurred') };
    const properties: ICustomProperties = { data: 'Value' };
    service.logException(telemetry, properties);

    expect(appInsights.trackException).toHaveBeenCalledWith(telemetry, properties);
  });

  it('should transfer trace data', () => {
    const telemetry: ITraceTelemetry = { message: 'Test' };
    const properties: ICustomProperties = { data: 'Value' };
    service.logTrace(telemetry, properties);

    expect(appInsights.trackTrace).toHaveBeenCalledWith(telemetry, properties);
  });
});
