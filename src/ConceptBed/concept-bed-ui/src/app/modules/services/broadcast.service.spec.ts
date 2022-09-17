import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { firstValueFrom } from 'rxjs';

import { telemetryMock } from '@modules/services/telemetry.service.spec';
import { BroadcastService } from './broadcast.service';
import { MessageType } from './models/message-type.enum';
import { Message, TelemetryService } from './services.module';

describe('BroadastService', () => {
  let service: BroadcastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TelemetryService, useValue: telemetryMock }
      ]
    }).compileComponents();
    service = TestBed.inject(BroadcastService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should broadcast default message', async () => {
    const text: string = 'Operation has some data.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.message(text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Default, text, timeout, canClose));
    expect(telemetryMock.logTrace).toHaveBeenCalledWith({ message: text, severityLevel: SeverityLevel.Verbose });
  });

  it('should broadcast success message', async () => {
    const text: string = 'Operation has completed successfully.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.success(text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Success, text, timeout, canClose));
    expect(telemetryMock.logTrace).toHaveBeenCalledWith({ message: text, severityLevel: SeverityLevel.Information });
  });

  it('should broadcast warning message', async () => {
    const text: string = 'Operation has potential issues.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.warning(text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Warning, text, timeout, canClose));
    expect(telemetryMock.logTrace).toHaveBeenCalledWith({ message: text, severityLevel: SeverityLevel.Warning });
  });

  it('should broadcast error message', async () => {
    const text: string = 'Operation has failed.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.error(text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Error, text, timeout, canClose));
    expect(telemetryMock.logTrace).toHaveBeenCalledWith({ message: text, severityLevel: SeverityLevel.Error });
  });

  it('should broadcast environment message', async () => {
    const text: string = 'Environment has changed.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.environment(text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Environment, text, timeout, canClose));
    expect(telemetryMock.logTrace).toHaveBeenCalledWith({ message: text, severityLevel: SeverityLevel.Information });
  });

  it('should broadcast exception message', async () => {
    const url: string = 'https://test';
    const status: number = 500;
    const text: string = `Http failure response for ${url}: ${status} undefined`;
    const timeout: number = 10000;
    const canClose: boolean = true;

    const error = new HttpErrorResponse({ error: text, url, status })

    const expected = firstValueFrom(service.messages)
    const message = service.excepion(error, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Error, text, timeout, canClose));
    expect(telemetryMock.logException).toHaveBeenCalledWith({ error, severityLevel: SeverityLevel.Error });
  });

  it('should broadcast alert message', async () => {
    const type: MessageType = MessageType.Default;
    const text: string = 'This is alert.';
    const timeout: number = 10000;
    const canClose: boolean = true;

    const expected = firstValueFrom(service.messages)
    const message = service.alert(type, text, timeout, canClose);

    expect(await expected).toEqual(message);
    expect(message).toEqual(new Message(MessageType.Default, text, timeout, canClose));
  });
});
