import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouteReuseStrategy, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Persistent } from '@app/modules/services/models/persistent';

import { RoutingStrategyService } from './routing-strategy.service';
@Persistent()
@Component({})
class PersistentComponent {
}

const routes: Routes = [
  { path: 'persistent', component: PersistentComponent }
];

describe('RoutingStrategyService', () => {
  let service: RoutingStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: RouteReuseStrategy, useClass: RoutingStrategyService },
      ]
    });
    service = TestBed.inject(RoutingStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add persist route', () => {

  });
});
