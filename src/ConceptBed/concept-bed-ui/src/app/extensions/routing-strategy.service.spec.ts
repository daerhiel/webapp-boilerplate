import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Type } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouteReuseStrategy, Routes } from '@angular/router';

import { PersistanceMode, Persistent } from '@modules/services/models/persistent';
import { RoutingStrategyService } from './routing-strategy.service';

@Component({
  template: `<router-outlet></router-outlet>`
})
class RoutingComponent {
}

@Persistent()
@Component({})
class DefaultComponent {
  private static global: number = 0;
  id: number = DefaultComponent.global++;
}

@Persistent({ persistanceMode: PersistanceMode.Parent })
@Component({})
class ParentComponent {
  private static global: number = 0;
  id: number = ParentComponent.global++;
}

@Persistent({ persistanceMode: PersistanceMode.Global })
@Component({})
class GlobalComponent {
  private static global: number = 0;
  id: number = GlobalComponent.global++;
}

function getSnapshot(router: Router, component: Type<any> | null): ActivatedRouteSnapshot {
  let snapshot = router.routerState.snapshot.root;
  while (snapshot.children.length > 0 && snapshot.component !== component) {
    snapshot = snapshot.children[0];
  }
  return snapshot;
}

const routes: Routes = [
  { path: 'global', component: GlobalComponent },
  {
    path: 'parent', component: ParentComponent,
    children: [
      { path: 'default', component: DefaultComponent }
    ]
  }
];

describe('RoutingStrategyService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        RoutingComponent,
        GlobalComponent,
        ParentComponent,
        DefaultComponent
      ],
      providers: [
        { provide: RouteReuseStrategy, useClass: RoutingStrategyService },
      ]
    });
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should be created', inject([Router], (router: Router) => {
    expect(router.routeReuseStrategy).toBeInstanceOf(RoutingStrategyService);
  }));

  it('should persist global component from own route', inject([Router], async (router: Router) => {
    router.navigate(['global']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, GlobalComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should not persist parent component from own route', inject([Router], async (router: Router) => {
    router.navigate(['parent']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist parent component from child route', inject([Router], async (router: Router) => {
    router.navigate(['parent', 'default']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent']);
    await fixture.whenStable();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));
});
