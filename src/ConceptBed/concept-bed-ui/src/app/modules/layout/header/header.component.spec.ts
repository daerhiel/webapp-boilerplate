import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import { graphApiMock, localAccountId, picture, user } from '@modules/backend/graph-client.service.spec';
import { account, clearGraphPipeCache } from '@app/modules/backend/pipes/graph-picture.pipe.spec';
import { BackendModule } from '@modules/backend/backend.module';
import { LayoutModule } from '../layout.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BackendModule,
        LayoutModule,
        MatToolbarModule,
        MatIconModule
      ],
      declarations: [HeaderComponent],
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
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clearGraphPipeCache();
    graphApiMock(controller, user, 'me');
    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
