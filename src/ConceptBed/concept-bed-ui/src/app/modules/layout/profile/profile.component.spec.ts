import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalService } from '@azure/msal-angular';

import { configuration, guards, interceptors } from '@environments/authentication';
import { BackendModule } from '@app/modules/backend/backend.module';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BackendModule,
        MatCardModule,
        MatDividerModule,
        MatProgressBarModule,
        MatButtonModule,
        MsalModule.forRoot(
          new PublicClientApplication(configuration),
          guards, interceptors)
      ],
      declarations: [
        ProfileComponent
      ],
      providers: [
        MsalService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
