import { Component, NgZone } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { tap } from 'rxjs';

import { PortalComponent } from './portal.component';
import { Subscriptions } from '@modules/services/services.module';

@Component({ standalone: true })
class TestComponent {
}

const routes: Routes = [
  {
    path: 'parent', loadComponent: () => TestComponent, children: [
      { path: 'child', loadComponent: () => TestComponent }
    ]
  },
];

describe('PortalComponent', () => {
  let component: PortalComponent;
  let fixture: ComponentFixture<PortalComponent>;

  beforeEach(async () => {
    document.body.classList.add('mat-typography');

    await TestBed.configureTestingModule({
      imports: [
        TestComponent,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })
      ],
      declarations: [
        PortalComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should indicate loading parent route', inject([Router, NgZone], async (router: Router, ngZone: NgZone) => {
    const subscriptions = new Subscriptions();
    const history: boolean[] = [];
    subscriptions.subscribe(component.isRouteLoading$.pipe(tap(x => history.push(x))));
    expect(history).toEqual([false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent']);
    })

    expect(history).toEqual([true, false]);
    subscriptions.unsubscribe();
  }));

  it('should indicate loading nested child route', inject([Router, NgZone], async (router: Router, ngZone: NgZone) => {
    const subscriptions = new Subscriptions();
    const history: boolean[] = [];
    subscriptions.subscribe(component.isRouteLoading$.pipe(tap(x => history.push(x))));
    expect(history).toEqual([false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent/child']);
    })

    expect(history).toEqual([true, false]);
    subscriptions.unsubscribe();
  }));

  it('should indicate loading parent and then child route', inject([Router, NgZone], async (router: Router, ngZone: NgZone) => {
    const subscriptions = new Subscriptions();
    const history: boolean[] = [];
    subscriptions.subscribe(component.isRouteLoading$.pipe(tap(x => history.push(x))));
    expect(history).toEqual([false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent']);
    })

    expect(history).toEqual([true, false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent/child']);
    })

    expect(history).toEqual([true, false]);
    subscriptions.unsubscribe();
  }));

  it('should not indicate loading when back from child to parent', inject([Router, NgZone], async (router: Router, ngZone: NgZone) => {
    const subscriptions = new Subscriptions();
    const history: boolean[] = [];
    subscriptions.subscribe(component.isRouteLoading$.pipe(tap(x => history.push(x))));
    expect(history).toEqual([false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent/child']);
    })

    expect(history).toEqual([true, false]);

    history.splice(0, history.length);
    await ngZone.run(async () => {
      await router.navigate(['parent']);
    })

    expect(history).toEqual([]);
    subscriptions.unsubscribe();
  }));
});
