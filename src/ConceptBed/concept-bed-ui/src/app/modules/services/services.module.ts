import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscapeDirective } from './directives/escape.directive';

export * from './broadcast.service';
export * from './history.service';
export * from './error-handler.service';
export * from './telemetry.service';

export * from './directives/escape.directive';

export * from './models/message';
export * from './models/message-type.enum';
export * from './models/subscriptions';
export * from './models/navigation-target';
export * from './models/persistent';

export * from './reactive/guard';
export * from './reactive/cache';

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
