import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalService } from '@azure/msal-angular';

import { configuration, guards, interceptors } from '@environments/authentication';
import { BackendModule } from '@app/modules/backend/backend.module';
import { LayoutModule } from '../layout.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BackendModule,
        LayoutModule,
        MatToolbarModule,
        MatIconModule,
        MsalModule.forRoot(
          new PublicClientApplication(configuration),
          guards, interceptors)
      ],
      declarations: [HeaderComponent],
      providers: [MsalService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
