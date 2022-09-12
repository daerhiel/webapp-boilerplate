import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalService } from '@azure/msal-angular';

import { graphApiMock, localAccountId, picture, user } from '@modules/backend/graph-client.service.spec';
import { configuration, guards, interceptors } from '@environments/authentication';
import { BackendModule } from '@modules/backend/backend.module';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    graphApiMock(controller, user, 'me');
    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
