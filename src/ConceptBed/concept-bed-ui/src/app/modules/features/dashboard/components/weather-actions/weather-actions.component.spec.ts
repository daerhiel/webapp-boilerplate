import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherActionsComponent } from './weather-actions.component';

describe('WeatherActionsComponent', () => {
  let component: WeatherActionsComponent;
  let fixture: ComponentFixture<WeatherActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherActionsComponent

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
