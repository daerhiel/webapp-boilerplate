import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';

import { SidenavActionsComponent } from './sidenav-actions.component';

describe('SidenavActionsComponent', () => {
  let component: SidenavActionsComponent;
  let fixture: ComponentFixture<SidenavActionsComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatListModule
      ],
      declarations: [
        SidenavActionsComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavActionsComponent);
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
