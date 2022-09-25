import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { getSnapshot } from '@app/extensions/routing-strategy.service.spec';

import { NavigationTarget } from './navigation-target';

@Component({})
class RootComponent {
}

@Component({})
class TestComponent {
}

describe('NavigationTarget', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RootComponent,
        TestComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([{
          path: '', component: RootComponent, title: 'Home', children: [
            { path: 'test', pathMatch: 'prefix', component: TestComponent, title: 'Test' },
          ]
        }])
      ]
    }).compileComponents();
  });

  it('should create', inject([ActivatedRoute], (route: ActivatedRoute) => {
    expect(new NavigationTarget(route.snapshot)).toBeTruthy();
  }));

  it('should create from root', inject([Router], async (router: Router) => {
    await router.navigate(['']);
    const snapshot = getSnapshot(router, RootComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.component).toEqual(RootComponent);
    expect(navigation.path).toEqual(['']);
    expect(navigation.title).toEqual('Home');
    expect(navigation.routeConfig).toEqual(snapshot.routeConfig);
  }));

  it('should create from test', inject([Router], async (router: Router) => {
    await router.navigate(['test']);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.component).toEqual(TestComponent);
    expect(navigation.path).toEqual(['', 'test']);
    expect(navigation.title).toEqual('Test');
    expect(navigation.routeConfig).toEqual(snapshot.routeConfig);
  }));

  it('should match same navigation', inject([Router], async (router: Router) => {
    await router.navigate(['test']);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch(navigation)).toBeTrue();
  }));

  it('should match same segments', inject([Router], async (router: Router) => {
    await router.navigate(['test']);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', {})])).toBeTrue();
  }));

  it('should match same segments with matrix params', inject([Router], async (router: Router) => {
    await router.navigate(['test', { id: 'value' }]);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', { id: 'value' })])).toBeTrue();
  }));

  it('should not match same segments without matrix params', inject([Router], async (router: Router) => {
    await router.navigate(['test', { id: 'value' }]);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', {})])).toBeFalse();
  }));

  it('should not match same segments with matrix params', inject([Router], async (router: Router) => {
    await router.navigate(['test']);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', { id: 'value' })])).toBeFalse();
  }));

  it('should not match same segments with wrong matrix param value', inject([Router], async (router: Router) => {
    await router.navigate(['test', { id: 'text' }]);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', { id: 'value' })])).toBeFalse();
  }));

  it('should not match same segments with wrong matrix param name', inject([Router], async (router: Router) => {
    await router.navigate(['test', { name: 'value' }]);
    const snapshot = getSnapshot(router, TestComponent);
    const navigation = new NavigationTarget(snapshot);

    expect(navigation.isMatch([new UrlSegment('test', { id: 'value' })])).toBeFalse();
  }));
});
