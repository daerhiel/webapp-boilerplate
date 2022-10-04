import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';

import { DashboardActionsComponent } from './dashboard-actions.component';

describe('SidenavActionsComponent', () => {
  let component: DashboardActionsComponent;
  let fixture: ComponentFixture<DashboardActionsComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatListModule
      ],
      declarations: [
        DashboardActionsComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render actions header', () => {
    const header = fixture.debugElement.query(By.css('a[mat-list-item]'));

    expect(header.nativeElement).toBeTruthy();
  });
});
