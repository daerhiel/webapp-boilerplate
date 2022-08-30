import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router, Routes, TitleStrategy } from '@angular/router';

import { TitleStrategyService } from './title-strategy.service';
import { Title } from '@angular/platform-browser';

@Component({
  template: `<router-outlet></router-outlet>`
})
class RoutingComponent {
}

@Component({})
class DefaultComponent {
}

const routes: Routes = [
  { path: '', component: RoutingComponent },
  {
    path: 'home', title: 'Home', component: DefaultComponent, children: [
      { path: 'about', title: 'About', component: DefaultComponent }
    ]
  }
];

describe('TitleStrategyService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })
      ],
      declarations: [
        RoutingComponent,
        DefaultComponent
      ],
      providers: [
        { provide: TitleStrategy, useClass: TitleStrategyService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should be created', inject([Router], (router: Router) => {
    expect(router.titleStrategy).toBeTruthy();
  }));

  it('should have title for default route', inject([Router, Title], async (router: Router, title: Title) => {
    router.navigate(['']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed');
  }));

  it('should have title for home route', inject([Router, Title], async (router: Router, title: Title) => {
    router.navigate(['home']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - Home');
  }));

  it('should have title for about route', inject([Router, Title], async (router: Router, title: Title) => {
    router.navigate(['home/about']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - About');
  }));
});
