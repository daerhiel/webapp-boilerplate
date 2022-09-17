import { TestBed } from '@angular/core/testing';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { ErrorHandlerService } from './error-handler.service';
import { TelemetryService } from './telemetry.service';

const error = new Error('Error occurred');
const telemetryMock = jasmine.createSpyObj<TelemetryService>('TelemetryService', ['logException']);

fdescribe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TelemetryService, useValue: telemetryMock }
      ]
    }).compileComponents();
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sends telemetry event on error', () => {
    const spy = spyOn(console, 'error');
    service.handleError(error);

    expect(telemetryMock.logException).toHaveBeenCalledWith({ error, severityLevel: SeverityLevel.Error });
    expect(spy).toHaveBeenCalled();
  });
});
