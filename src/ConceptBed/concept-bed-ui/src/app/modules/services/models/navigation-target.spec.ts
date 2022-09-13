import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigationTarget } from './navigation-target';

describe('NavigationTarget', () => {
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create an instance', () => {
    expect(new NavigationTarget(route.snapshot)).toBeTruthy();
  });
});
