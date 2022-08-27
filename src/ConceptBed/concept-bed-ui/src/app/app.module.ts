import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, TitleStrategy } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

import { configuration, guards, interceptors } from '@environments/authentication';
import { ErrorHandlerService } from '@modules/services/services.module';
import { LayoutModule } from '@modules/layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { RoutingStrategyService } from './extensions/routing-strategy.service';
import { TitleStrategyService } from './extensions/title-strategy.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    AppRoutingModule,
    LayoutModule,
    MsalModule.forRoot(
      new PublicClientApplication(configuration),
      guards, interceptors)
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: RoutingStrategyService },
    { provide: TitleStrategy, useClass: TitleStrategyService }
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
