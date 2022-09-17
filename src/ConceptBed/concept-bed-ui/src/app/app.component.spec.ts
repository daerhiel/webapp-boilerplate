import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalModule } from '@azure/msal-angular';

import { configuration, guards, interceptors } from '@environments/authentication';
import { LayoutModule } from './modules/layout/layout.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        MatSidenavModule,
        LayoutModule,
        MsalModule.forRoot(
          new PublicClientApplication(configuration),
          guards, interceptors)
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should reference layout', () => {
    expect(component.layout).toBeTruthy();
  });
});
