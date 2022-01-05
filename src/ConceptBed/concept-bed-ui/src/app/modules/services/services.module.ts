import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscapeDirective } from './directives/escape.directive';

export * from './broadcast.service';
export * from './error-handler.service';
export * from './telemetry.service';

export * from './directives/escape.directive';

export * from './models/message';
export * from './models/message-type.enum';

@NgModule({
  declarations: [
    EscapeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    EscapeDirective
  ]
})
export class ServicesModule { }
