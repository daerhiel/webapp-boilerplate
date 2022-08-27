import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Observable, Subject } from 'rxjs';

import { TelemetryService } from './telemetry.service';
import { Message } from './models/message';
import { MessageType } from './models/message-type.enum';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService implements OnDestroy {
  private messages$ = new Subject<Message>();

  get messages(): Observable<Message> { return this.messages$.asObservable(); }

  constructor(private telemetry: TelemetryService) {
  }

  ngOnDestroy(): void {
    this.messages$.complete();
  }

  success(message: string, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logTrace({ message, severityLevel: SeverityLevel.Information });
    return this.alert(MessageType.Success, message, timeout, canClose);
  }

  error(message: string, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logTrace({ message, severityLevel: SeverityLevel.Error });
    return this.alert(MessageType.Error, message, timeout, canClose);
  }

  message(message: string, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logTrace({ message, severityLevel: SeverityLevel.Verbose });
    return this.alert(MessageType.Default, message, timeout, canClose);
  }

  warning(message: string, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logTrace({ message, severityLevel: SeverityLevel.Warning });
    return this.alert(MessageType.Warning, message, timeout, canClose);
  }

  environment(message: string, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logTrace({ message, severityLevel: SeverityLevel.Information });
    return this.alert(MessageType.Environment, message, timeout, canClose);
  }

  excepion(error: HttpErrorResponse, timeout: number = 12000, canClose: boolean = true): Message {
    this.telemetry.logException({ error, severityLevel: SeverityLevel.Error });
    return this.alert(MessageType.Error, error?.error?.message ?? error?.message, timeout, canClose);
  }

  alert(type: MessageType, message: string, timeout: number, canClose: boolean): Message {
    const alert = new Message(type, message, timeout, canClose);
    this.messages$.next(alert);
    return alert;
  }
}
