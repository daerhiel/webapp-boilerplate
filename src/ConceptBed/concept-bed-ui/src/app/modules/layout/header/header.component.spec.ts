import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By, Title } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MsalService } from '@azure/msal-angular';
import { firstValueFrom } from 'rxjs';

import { account, graphApiMock, localAccountId, msalServiceMock, picture } from '@modules/backend/graph-client.service.spec';
import { clearGraphPipeCache } from '@modules/backend/pipes/graph-picture.pipe.spec';
import { BackendModule, GraphPicturePipe } from '@modules/backend/backend.module';
import { LayoutService } from '../layout.service';
import { LayoutModule } from '../layout.module';
import { HeaderComponent } from './header.component';

const appTitle = 'App Title';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');
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
      providers: [
        { provide: MsalService, useValue: msalServiceMock }
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject([Title], (title: Title) => {
    clearGraphPipeCache();
    title.setTitle(appTitle);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);
    fixture.detectChanges();
  }));

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should render home button with title', inject([Title], async (title: Title) => {
    const home = fixture.debugElement.query(By.css('a[mat-button]'));

    expect(home.nativeElement).not.toBeNull();

    const wrapper = home.query(By.css('span.mat-button-wrapper'));

    expect(wrapper.nativeElement).not.toBeNull();
    expect(wrapper.nativeElement.innerHTML).toEqual(title.getTitle());
  }));

  it('should render menu button', async () => {
    const favorites = fixture.debugElement.query(By.css('button[mat-icon-button]#menu'));

    expect(favorites.nativeElement).not.toBeNull();

    const icon = favorites.query(By.css('mat-icon'));

    expect(icon.nativeElement).not.toBeNull();
    expect(icon.nativeElement.innerHTML).toEqual('menu');
  });

  it('should should toggle on sidenav', inject([LayoutService], async (layout: LayoutService) => {
    layout.toggleSidenav(false);
    await firstValueFrom(layout.isSidenavOpen$);

    const favorites = fixture.debugElement.query(By.css('button[mat-icon-button]#menu'));
    favorites.nativeElement.click();

    expect(await firstValueFrom(layout.isSidenavOpen$)).toBeTrue();
  }));

  it('should should toggle off sidenav', inject([LayoutService], async (layout: LayoutService) => {
    layout.toggleSidenav(true);
    await firstValueFrom(layout.isSidenavOpen$);

    const favorites = fixture.debugElement.query(By.css('button[mat-icon-button]#menu'));
    favorites.nativeElement.click();

    expect(await firstValueFrom(layout.isSidenavOpen$)).toBeFalse();
  }));

  it('should render favorites button', async () => {
    const favorites = fixture.debugElement.query(By.css('button[mat-icon-button]#favorite'));

    expect(favorites.nativeElement).not.toBeNull();

    const icon = favorites.query(By.css('mat-icon'));

    expect(icon.nativeElement).not.toBeNull();
    expect(icon.nativeElement.innerHTML).toEqual('favorite');
  });

  it('should render help button', async () => {
    const help = fixture.debugElement.query(By.css('button[mat-icon-button]#help'));

    expect(help.nativeElement).not.toBeNull();

    const icon = help.query(By.css('mat-icon'));

    expect(icon.nativeElement).not.toBeNull();
    expect(icon.nativeElement.innerHTML).toEqual('help');
  });

  it('should render profile link', async () => {
    const link = fixture.debugElement.query(By.css('a[mat-icon-button]#profile'));

    expect(link.nativeElement).not.toBeNull();

    const icon = link.query(By.css('img'));

    expect(icon.nativeElement).not.toBeNull();

    const profile = fixture.debugElement.query(By.css('app-profile'));

    expect(profile?.nativeElement).toBeUndefined();
  });

  it('should render toggle profile closed', async () => {
    const link = fixture.debugElement.query(By.css('a[mat-icon-button]#profile'));
    fixture.componentInstance.toggleProfile(true);
    await firstValueFrom(fixture.componentInstance.isProfileOpen$);
    fixture.detectChanges();

    link.nativeElement.click();
    fixture.detectChanges()

    expect(await firstValueFrom(fixture.componentInstance.isProfileOpen$)).toBeFalse();

    const profile = fixture.debugElement.query(By.css('app-profile'));

    expect(profile?.nativeElement).toBeUndefined();
  });

  it('should render toggle profile open', async () => {
    const link = fixture.debugElement.query(By.css('a[mat-icon-button]#profile'));
    fixture.componentInstance.toggleProfile(false);
    await firstValueFrom(fixture.componentInstance.isProfileOpen$);
    fixture.detectChanges();

    link.nativeElement.click();
    fixture.detectChanges()

    expect(await firstValueFrom(fixture.componentInstance.isProfileOpen$)).toBeTrue();

    const profile = fixture.debugElement.query(By.css('app-profile'));

    expect(profile?.nativeElement).not.toBeUndefined();
  });

  it('should close profile on click aside', async () => {
    const link = fixture.debugElement.query(By.css('a[mat-icon-button]#profile'));
    fixture.componentInstance.toggleProfile(true);
    await firstValueFrom(fixture.componentInstance.isProfileOpen$);
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('button[mat-icon-button]#menu'))
    menu.nativeElement.click();
    fixture.detectChanges()

    expect(await firstValueFrom(fixture.componentInstance.isProfileOpen$)).toBeFalse();

    const profile = fixture.debugElement.query(By.css('app-profile'));

    expect(profile?.nativeElement).toBeUndefined();
  });

  it('should display current user picture', async () => {
    await firstValueFrom(GraphPicturePipe.get(account));
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));

    expect(img.nativeElement).not.toBeNull();
    expect(img.nativeElement.title).toEqual(account.name);
    expect(img.nativeElement.src).toMatch(/^blob:http:/i);
  });
});
