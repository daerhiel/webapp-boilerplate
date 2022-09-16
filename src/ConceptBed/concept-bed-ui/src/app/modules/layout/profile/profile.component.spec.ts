import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MsalService } from '@azure/msal-angular';

import { account, graphApiMock, localAccountId, msalServiceMock, picture, user } from '@modules/backend/graph-client.service.spec';
import { clearGraphPipeCache } from '@modules/backend/pipes/graph-picture.pipe.spec';
import { BackendModule, GraphPicturePipe } from '@modules/backend/backend.module';
import { ProfileComponent } from './profile.component';
import { firstValueFrom, timer } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');
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
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    clearGraphPipeCache();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

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

    const title = fixture.debugElement.query(By.css('mat-card-title'));
    expect(title.nativeElement.innerHTML).toEqual(account.name);

    const subtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));
    expect(subtitle.nativeElement.innerHTML).toEqual(account.username);
  });

  it('should display current user picture', async () => {
    while (await firstValueFrom(component.isLoading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    await firstValueFrom(GraphPicturePipe.get(account));
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement).not.toBeNull();
    expect(img.nativeElement.src).toMatch(/^blob:http:/i);
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

    const button = fixture.debugElement.query(By.css('button[mat-button]#logout'));
    expect(button.nativeElement).toBeTruthy();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(msalServiceMock.logoutRedirect).toHaveBeenCalled();
  });
});
