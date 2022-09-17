import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, timer } from 'rxjs';

import { contentApiMock, weathers } from '@modules/backend/content-api.service.spec';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatIconModule
      ],
      declarations: [
        DashboardComponent
      ],
      providers: [
        { provide: MatPaginator, useClass: MatPaginator }
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    contentApiMock(controller, weathers, 'weatherforecast', [], { $top: 5, $skip: 0 });
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toolbar', () => {
    const toolbar = fixture.debugElement.query(By.css('div#toolbar'));

    expect(toolbar.nativeElement).toBeTruthy();

    const field = toolbar.query(By.css('mat-form-field.search'));
    const search = field.query(By.css('input[matInput]'));
    const icon = field.query(By.css('mat-icon[matPrefix]'));

    expect(field.nativeElement).toBeTruthy();
    expect(search.nativeElement).toBeTruthy();
    expect(icon.nativeElement).toBeTruthy();
    expect(icon.nativeElement.innerHTML).toEqual('search');
  });

  it('should render spinner on load', async () => {
    while (await firstValueFrom(component.data.loading$)) {
      await (firstValueFrom(timer(100)));
    }

    const toolbar = fixture.debugElement.query(By.css('div#toolbar'));
    const search = toolbar.query(By.css('mat-form-field.search input[matInput]'));
    search.nativeElement.value = 'Free';
    search.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    while (!await firstValueFrom(component.data.loading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    expect(await firstValueFrom(component.data.loading$)).toBeTrue();

    contentApiMock(controller, weathers, 'weatherforecast', [], { $filter: `contains(summary,'Free')`, $top: 5, $skip: 0 });
    const spinner = toolbar.query(By.css('mat-spinner'));

    expect(spinner.nativeElement).toBeTruthy();

    while (await firstValueFrom(component.data.loading$)) {
      await (firstValueFrom(timer(100)));
    }
    fixture.detectChanges();

    expect(toolbar.query(By.css('mat-spinner'))).toBeNull();
  });
});
