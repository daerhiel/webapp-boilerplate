import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ServicesModule } from '@modules/services/services.module';
import { GraphPicturePipe } from './pipes/graph-picture.pipe';
import { DefaultPictureDirective } from './directives/default-picture.directive';

export * from './content-api.service';
export * from './content-state.service';
export * from './graph-client.service';

export * from './pipes/graph-picture.pipe';
export * from './directives/default-picture.directive';

export * from './graph/user-identity-api';

export * from './models/weather-forecast';
export * from './models/weather-forecast-api';

export * from './structure/deep-partial';
export * from './structure/odata-query';
export * from './structure/odata-result-set';
export * from './structure/odata-source';
export * from './structure/url-utilities';
export * from './structure/data-utilities';
export * from './structure/problem-details';
export * from './structure/problem-details-api';
export * from './structure/exception-details-api';

@NgModule({
  declarations: [
    GraphPicturePipe,
    DefaultPictureDirective
  ],
  imports: [
    HttpClientModule,
    ServicesModule
  ],
  exports: [
    GraphPicturePipe,
    DefaultPictureDirective
  ]
})
export class BackendModule { }
