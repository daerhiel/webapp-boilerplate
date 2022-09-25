import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WeatherActionsComponent } from './weather-actions.component';
import { MatListModule } from '@angular/material/list';

describe('WeatherActionsComponent', () => {
  let component: WeatherActionsComponent;
  let fixture: ComponentFixture<WeatherActionsComponent>;
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatListModule
      ],
      declarations: [
        WeatherActionsComponent
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
