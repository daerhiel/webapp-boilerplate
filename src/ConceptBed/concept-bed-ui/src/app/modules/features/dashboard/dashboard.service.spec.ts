import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();
    service = TestBed.inject(DashboardService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });
});
