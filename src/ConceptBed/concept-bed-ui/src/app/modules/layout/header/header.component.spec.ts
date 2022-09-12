import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalService } from '@azure/msal-angular';

import { graphApiMock, user } from '@modules/backend/graph-client.service.spec';
import { configuration, guards, interceptors } from '@environments/authentication';
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
        MatIconModule,
        MsalModule.forRoot(
          new PublicClientApplication(configuration),
          guards, interceptors)
      ],
      declarations: [HeaderComponent],
      providers: [MsalService]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    graphApiMock(controller, user, 'me');

    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
