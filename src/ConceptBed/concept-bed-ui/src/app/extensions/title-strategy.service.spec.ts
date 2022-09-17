import { Component } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router, Routes, TitleStrategy } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';

import { TitleStrategyService } from './title-strategy.service';

@Component({
  template: `<router-outlet></router-outlet>`
})
class RoutingComponent {
}

@Component({})
class HomeComponent {
}

@Component({})
class AboutComponent {
}

const routes: Routes = [
  {
    path: '', title: 'Home', component: HomeComponent, children: [
      { path: 'about', title: 'About', component: AboutComponent }
    ]
  }
];

describe('TitleStrategyService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledNonBlocking' })
      ],
      declarations: [
        RoutingComponent,
        HomeComponent,
        AboutComponent
      ],
      providers: [
        { provide: TitleStrategy, useClass: TitleStrategyService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should create an instance', inject([Router], (router: Router) => {
    expect(router.titleStrategy).toBeTruthy();
  }));

  it('should have title for home route', inject([Router, Title], async (router: Router, title: Title) => {
    await router.navigate(['']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - Home');
  }));

  it('should have title for about route', inject([Router, Title], async (router: Router, title: Title) => {
    await router.navigate(['about']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - About');
  }));
});
