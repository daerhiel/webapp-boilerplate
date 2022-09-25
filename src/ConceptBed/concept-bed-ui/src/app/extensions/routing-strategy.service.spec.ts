import { Component, OnDestroy, Type } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouteReuseStrategy, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PersistanceMode, Persistent } from '@modules/services/models/persistent';
import { RoutingStrategyService } from './routing-strategy.service';

@Component({
  template: `<router-outlet></router-outlet>`
})
class RoutingComponent {
}

@Component({})
class VolatileComponent implements OnDestroy {
  static readonly instances: VolatileComponent[] = [];
  static get current(): VolatileComponent | null { return this.instances[this.instances.length - 1] ?? null; };
  constructor() { VolatileComponent.instances.push(this); }
  ngOnDestroy(): void { VolatileComponent.instances.splice(VolatileComponent.instances.findIndex(x => x === this), 1); }
}

@Persistent()
@Component({})
class DefaultComponent implements OnDestroy {
  static readonly instances: DefaultComponent[] = [];
  static get current(): DefaultComponent | null { return this.instances[this.instances.length - 1] ?? null; };
  constructor() { DefaultComponent.instances.push(this); }
  ngOnDestroy(): void { DefaultComponent.instances.splice(DefaultComponent.instances.findIndex(x => x === this), 1); }
}

@Persistent({ persistanceMode: PersistanceMode.Parent })
@Component({})
class ParentComponent implements OnDestroy {
  static readonly instances: ParentComponent[] = [];
  static get current(): ParentComponent | null { return this.instances[this.instances.length - 1] ?? null; };
  constructor() { ParentComponent.instances.push(this); }
  ngOnDestroy(): void { ParentComponent.instances.splice(ParentComponent.instances.findIndex(x => x === this), 1); }
}

@Persistent({ persistanceMode: PersistanceMode.Global })
@Component({})
class GlobalComponent implements OnDestroy {
  static readonly instances: GlobalComponent[] = [];
  static get current(): GlobalComponent | null { return this.instances[this.instances.length - 1] ?? null; };
  constructor() { GlobalComponent.instances.push(this); }
  ngOnDestroy(): void { GlobalComponent.instances.splice(GlobalComponent.instances.findIndex(x => x === this), 1); }
}

export function getSnapshot(router: Router, component: Type<any> | null): ActivatedRouteSnapshot {
  let snapshot = router.routerState.snapshot.root;
  while (snapshot.children.length > 0 && snapshot.component !== component) {
    snapshot = snapshot.children[0];
  }
  return snapshot;
}

const routes: Routes = [
  { path: '', component: RoutingComponent },
  {
    path: 'volatile', component: VolatileComponent, children: [
      { path: 'volatile', component: VolatileComponent }
    ]
  },
  {
    path: 'default', component: DefaultComponent,
    children: [
      { path: 'volatile', component: VolatileComponent },
      { path: 'mutative', component: VolatileComponent }
    ]
  },
  {
    path: 'global', component: GlobalComponent,
    children: [
      { path: 'volatile', component: VolatileComponent },
      { path: 'mutative', component: VolatileComponent }
    ]
  },
  {
    path: 'parent', component: ParentComponent,
    children: [
      { path: 'volatile', component: VolatileComponent },
      { path: 'mutative', component: VolatileComponent }
    ]
  }
];

describe('RoutingStrategyService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })
      ],
      declarations: [
        RoutingComponent,
        GlobalComponent,
        VolatileComponent,
        ParentComponent,
        DefaultComponent
      ],
      providers: [
        { provide: RouteReuseStrategy, useClass: RoutingStrategyService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should create', inject([Router], (router: Router) => {
    expect(router.routeReuseStrategy).toBeInstanceOf(RoutingStrategyService);
  }));

  it('should not persist volatile component from own route', inject([Router], async (router: Router) => {
    await router.navigate(['volatile']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, VolatileComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(VolatileComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should not persist volatile component from child route', inject([Router], async (router: Router) => {
    await router.navigate(['volatile']);
    await fixture.whenStable();
    const parent = VolatileComponent.current;
    const snapshot = getSnapshot(router, VolatileComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['volatile/volatile']);
    await fixture.whenStable();
    expect(VolatileComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(VolatileComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist default component from own route', inject([Router], async (router: Router) => {
    await router.navigate(['default']);
    await fixture.whenStable();
    const parent = DefaultComponent.current;
    const snapshot = getSnapshot(router, DefaultComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist default component across child route', inject([Router], async (router: Router) => {
    await router.navigate(['default']);
    await fixture.whenStable();
    const parent = DefaultComponent.current;
    const snapshot = getSnapshot(router, DefaultComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['default', 'volatile']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['default']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist default component across child routes', inject([Router], async (router: Router) => {
    await router.navigate(['default']);
    await fixture.whenStable();
    const parent = DefaultComponent.current;
    const snapshot = getSnapshot(router, DefaultComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['default', 'volatile']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['default', 'mutative']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['default']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(DefaultComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist global component from own route', inject([Router], async (router: Router) => {
    await router.navigate(['global']);
    await fixture.whenStable();
    const parent = GlobalComponent.current;
    const snapshot = getSnapshot(router, GlobalComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist global component across child route', inject([Router], async (router: Router) => {
    await router.navigate(['global']);
    await fixture.whenStable();
    const parent = GlobalComponent.current;
    const snapshot = getSnapshot(router, GlobalComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['global', 'volatile']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['global']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should persist global component across child routes', inject([Router], async (router: Router) => {
    await router.navigate(['global']);
    await fixture.whenStable();
    const parent = GlobalComponent.current;
    const snapshot = getSnapshot(router, GlobalComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['global', 'volatile']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['global', 'mutative']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['global']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(GlobalComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeTruthy();
  }));

  it('should not persist parent component from own route', inject([Router], async (router: Router) => {
    await router.navigate(['parent']);
    await fixture.whenStable();
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist parent component across child route', inject([Router], async (router: Router) => {
    await router.navigate(['parent']);
    await fixture.whenStable();
    const parent = ParentComponent.current;
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['parent', 'volatile']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['parent']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));

  it('should persist parent component across child routes', inject([Router], async (router: Router) => {
    await router.navigate(['parent']);
    await fixture.whenStable();
    const parent = ParentComponent.current;
    const snapshot = getSnapshot(router, ParentComponent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['parent', 'volatile']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['parent', 'mutative']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['parent']);
    await fixture.whenStable();
    expect(ParentComponent.current).toEqual(parent);
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();

    await router.navigate(['']);
    await fixture.whenStable();
    expect(ParentComponent.current).toBeNull();
    expect(router.routeReuseStrategy.retrieve(snapshot)).toBeFalsy();
  }));
});
