import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';
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
class DefaultComponent implements OnInit, OnDestroy {
  static current: DefaultComponent | null = null;
  ngOnInit(): void { DefaultComponent.current = this; }
  ngOnDestroy(): void { DefaultComponent.current = null; }
}

@Persistent({ persistanceMode: PersistanceMode.Parent })
@Component({})
class ParentComponent implements OnDestroy {
  static current: ParentComponent | null = null;
  ngOnInit(): void { ParentComponent.current = this; }
  ngOnDestroy(): void { ParentComponent.current = null; }
}

@Persistent({ persistanceMode: PersistanceMode.Global })
@Component({})
class GlobalComponent implements OnDestroy {
  static current: GlobalComponent | null = null;
  ngOnInit(): void { GlobalComponent.current = this; }
  ngOnDestroy(): void { GlobalComponent.current = null; }
}

function getSnapshot(router: Router, component: Type<any> | null): ActivatedRouteSnapshot {
  let snapshot = router.routerState.snapshot.root;
  while (snapshot.children.length > 0 && snapshot.component !== component) {
    snapshot = snapshot.children[0];
  }
  return snapshot;
}

const routes: Routes = [
  { path: '', component: RoutingComponent },
  {
    path: 'default', component: DefaultComponent, children: [
      { path: 'default', component: DefaultComponent }
    ]
  },
  { path: 'global', component: GlobalComponent },
  {
    path: 'parent', component: ParentComponent,
    children: [
      { path: 'default1', component: DefaultComponent },
      { path: 'default2', component: DefaultComponent }
    ]
  }
];

describe('RoutingStrategyService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })
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
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should be created', inject([Router], (router: Router) => {
    expect(router.routeReuseStrategy).toBeInstanceOf(RoutingStrategyService);
  }));

  it('should not persist default component from own route', inject([Router], async (router: Router) => {
    router.navigate(['default']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, DefaultComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should not persist default component from child route', inject([Router], async (router: Router) => {
    router.navigate(['default']);
    await fixture.whenStable();
    const parent = DefaultComponent.current;
    const snapshot = getSnapshot(router, DefaultComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['default/default']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist global component from own route', inject([Router], async (router: Router) => {
    router.navigate(['global']);
    await fixture.whenStable();
    const parent = GlobalComponent.current;
    const snapshot = getSnapshot(router, GlobalComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should not persist parent component from own route', inject([Router], async (router: Router) => {
    router.navigate(['parent']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist parent component from child route', inject([Router], async (router: Router) => {
    router.navigate(['parent']);
    await fixture.whenStable();
    const parent = ParentComponent.current;
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent', 'default1']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist parent component between child routes', inject([Router], async (router: Router) => {
    router.navigate(['parent']);
    await fixture.whenStable();
    const parent = ParentComponent.current;
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent', 'default1']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent', 'default2']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['parent']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));
});
