import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Routes } from '@angular/router';
import { By, Title } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MsalService } from '@azure/msal-angular';
import { firstValueFrom, timer } from 'rxjs';

import { account, graphApiMock, localAccountId, msalServiceMock, picture, user } from '@modules/backend/graph-client.service.spec';
import { clearGraphPipeCache } from '@modules/backend/pipes/graph-picture.pipe.spec';
import { BackendModule, GraphPicturePipe } from '@modules/backend/backend.module';
import { LayoutModule } from '../layout.module';
import { HeaderComponent } from './header.component';

const appTitle = 'App Title';

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
      providers: [
        { provide: MsalService, useValue: msalServiceMock }
      ],
      teardown: {
        destroyAfterEach: false
      }
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject([Title], (title: Title) => {
    clearGraphPipeCache();
    title.setTitle(appTitle);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    graphApiMock(controller, user, 'me');
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

  fit('should render favorites button', async () => {
    const favorites = fixture.debugElement.query(By.css('button[mat-icon-button]#favorite'));

    expect(favorites.nativeElement).not.toBeNull();

    const icon = favorites.query(By.css('mat-icon'));

    expect(icon.nativeElement).not.toBeNull();
    expect(icon.nativeElement.innerHTML).toEqual('favorite');
  });

  fit('should render help button', async () => {
    const help = fixture.debugElement.query(By.css('button[mat-icon-button]#help'));

    expect(help.nativeElement).not.toBeNull();

    const icon = help.query(By.css('mat-icon'));

    expect(icon.nativeElement).not.toBeNull();
    expect(icon.nativeElement.innerHTML).toEqual('help');
  });

  it('should display current user picture', async () => {
    await firstValueFrom(GraphPicturePipe.get(account));
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));

    expect(img.nativeElement).not.toBeNull();
    expect(img.nativeElement.src).toMatch(/^blob:http:/i);
  });
});
