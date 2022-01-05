import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavActionsComponent } from './sidenav-actions.component';

describe('SidenavActionsComponent', () => {
  let component: SidenavActionsComponent;
  let fixture: ComponentFixture<SidenavActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavActionsComponent ]
    })
    .compileComponents();
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
