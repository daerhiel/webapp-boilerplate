import { TestBed } from '@angular/core/testing';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { telemetryMock } from '@modules/services/telemetry.service.spec';
import { ErrorHandlerService } from './error-handler.service';
import { TelemetryService } from './telemetry.service';

const error = new Error('Error occurred');

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TelemetryService, useValue: telemetryMock }
      ]
    }).compileComponents();
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should send telemetry event on error', () => {
    const spy = spyOn(console, 'error');
    service.handleError(error);

    expect(telemetryMock.logException).toHaveBeenCalledWith({ error, severityLevel: SeverityLevel.Error });
    expect(spy).toHaveBeenCalled();
  });
});
