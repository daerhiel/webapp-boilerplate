import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { EndSessionRequest, PublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import { graphApiMock, localAccountId, picture, user } from '@modules/backend/graph-client.service.spec';
import { account, clearGraphPipeCache } from '@modules/backend/pipes/graph-picture.pipe.spec';
import { BackendModule } from '@modules/backend/backend.module';
import { ProfileComponent } from './profile.component';
import { firstValueFrom, Observable, of, timer } from 'rxjs';

const msalServiceMock = jasmine.createSpyObj<MsalService>('MsalServiceMock', ['logoutRedirect'], {
  instance: jasmine.createSpyObj<PublicClientApplication>('ClientApplication', { getAllAccounts: [account] })
});

fdescribe('ProfileComponent', () => {
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
      providers: [
        { provide: MsalService, useValue: msalServiceMock }
      ],
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

  it('should display current user', async () => {
    while (await firstValueFrom(component.isLoading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    expect(account).toEqual(account);

    const title: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.innerHTML).toEqual(account.name);

    const subtitle: HTMLElement = fixture.nativeElement.querySelector('mat-card-subtitle');
    expect(subtitle.innerHTML).toEqual(account.username);
  });

  it('should load profile', async () => {
    while (await firstValueFrom(component.isLoading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    expect(account).toEqual(account);

    expect(await firstValueFrom(component.profile$)).toEqual(user);
    expect(component.profile).toEqual(user);
    expect(await firstValueFrom(component.isLoading$)).toBeFalse();
  });

  it('should run logout', async () => {
    while (await firstValueFrom(component.isLoading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-button]#logout');
    expect(button).toBeTruthy();

    button.click();
    fixture.detectChanges();

    expect(msalServiceMock.logoutRedirect).toHaveBeenCalled();
  });
});
