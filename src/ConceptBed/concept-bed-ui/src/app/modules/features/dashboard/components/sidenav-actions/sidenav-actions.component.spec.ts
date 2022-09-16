import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';

import { SidenavActionsComponent } from './sidenav-actions.component';

describe('SidenavActionsComponent', () => {
  let component: SidenavActionsComponent;
  let fixture: ComponentFixture<SidenavActionsComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');
    await TestBed.configureTestingModule({
      imports: [
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
});
