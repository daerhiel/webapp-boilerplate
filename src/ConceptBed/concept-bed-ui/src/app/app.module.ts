import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

import { configuration, guards, interceptors } from 'src/environments/authentication';
import { ErrorHandlerService } from './modules/services/services.module';
import { BackendModule } from './modules/backend/backend.module';
import { LayoutModule } from './modules/layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { RoutingStrategyService } from './extensions/routing-strategy.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BackendModule,
    LayoutModule,
    MatSidenavModule,
    MsalModule.forRoot(
      new PublicClientApplication(configuration),
      guards, interceptors)
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: RoutingStrategyService }
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
