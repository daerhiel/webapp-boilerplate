import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import { graphApiMock, localAccountId, picture, user } from '@modules/backend/graph-client.service.spec';
import { account, clearGraphPipeCache } from '@modules/backend/pipes/graph-picture.pipe.spec';
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
        MatButtonModule
      ],
      declarations: [
        ProfileComponent
      ],
      providers: [{
        provide: MsalService, useValue: jasmine.createSpyObj<MsalService>('MsalServiceMock', {}, {
          instance: jasmine.createSpyObj<PublicClientApplication>('ClientApplication', { getAllAccounts: [account] })
        })
      }],
      teardown: {
        destroyAfterEach: false
      }
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clearGraphPipeCache();
    graphApiMock(controller, user, 'me');
    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
