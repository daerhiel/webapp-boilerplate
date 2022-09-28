import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { HistoryService } from './history.service';
import { Container } from './models/container';

@Container()
@Component({})
class RootComponent {
}

@Component({})
class TestComponent {
}

@Component({})
class HelpComponent {
}

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '', title: 'Root', children: [
              { path: '', title: 'Root', component: RootComponent },
              { path: 'test', title: 'Test', component: TestComponent },
            ]
          },
          { path: 'help', title: 'Help', component: HelpComponent },
        ], { initialNavigation: 'enabledNonBlocking' })
      ]
    }).compileComponents();
    service = TestBed.inject(HistoryService);
  });

  beforeEach(inject([Router], async (router: Router) => {
    await router.navigate(['']);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to root', inject([Router], async (router: Router) => {
    const segment = service.segment;
    expect(segment).toBeTruthy();
    expect(segment!.path).toEqual(['']);
    expect(segment!.title).toEqual('Root');

    const navigation = service.activated;
    expect(navigation.map(x => x.path)).toEqual([['']]);
    expect(navigation.map(x => x.title)).toEqual(['Root']);

    const container = service.container;
    expect(container.map(x => x.path)).toEqual([['']]);
    expect(container.map(x => x.title)).toEqual(['Root']);

    const breadcrumbs = service.breadcrumbs;
    expect(breadcrumbs.map(x => x.path)).toEqual([['']]);
    expect(breadcrumbs.map(x => x.title)).toEqual(['Root']);

    const navigations = service.navigations;
    expect(navigations.map(x => x.path)).toEqual([['']]);
    expect(navigations.map(x => x.title)).toEqual(['Root']);
  }));

  it('should navigate to container child', inject([Router], async (router: Router) => {
    await router.navigate(['', 'test']);

    const segment = service.segment;
    expect(segment).toBeTruthy();
    expect(segment!.path).toEqual(['', 'test']);
    expect(segment!.title).toEqual('Test');

    const navigation = service.activated;
    expect(navigation.map(x => x.path)).toEqual([[''], ['', 'test']]);
    expect(navigation.map(x => x.title)).toEqual(['Root', 'Test']);

    const container = service.container;
    expect(container.map(x => x.path)).toEqual([['']]);
    expect(container.map(x => x.title)).toEqual(['Root']);

    const breadcrumbs = service.breadcrumbs;
    expect(breadcrumbs.map(x => x.path)).toEqual([[''], ['', 'test']]);
    expect(breadcrumbs.map(x => x.title)).toEqual(['Root', 'Test']);

    const navigations = service.navigations;
    expect(navigations.map(x => x.path)).toEqual([[''], ['', 'test']]);
    expect(navigations.map(x => x.title)).toEqual(['Root', 'Test']);
  }));

  it('should navigate to neighbor', inject([Router], async (router: Router) => {
    await router.navigate(['', 'help']);

    const segment = service.segment;
    expect(segment).toBeTruthy();
    expect(segment!.path).toEqual(['', 'help']);
    expect(segment!.title).toEqual('Help');

    const navigation = service.activated;
    expect(navigation.map(x => x.path)).toEqual([['', 'help']]);
    expect(navigation.map(x => x.title)).toEqual(['Help']);

    const container = service.container;
    expect(container.map(x => x.path)).toEqual([]);
    expect(container.map(x => x.title)).toEqual([]);

    const breadcrumbs = service.breadcrumbs;
    expect(breadcrumbs.map(x => x.path)).toEqual([['', 'help']]);
    expect(breadcrumbs.map(x => x.title)).toEqual(['Help']);

    const navigations = service.navigations;
    expect(navigations.map(x => x.path)).toEqual([[''], ['', 'help']]);
    expect(navigations.map(x => x.title)).toEqual(['Root', 'Help']);
  }));
});
