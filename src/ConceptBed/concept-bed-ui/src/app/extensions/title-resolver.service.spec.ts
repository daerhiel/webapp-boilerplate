import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router, Routes, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TitleResolverService } from './title-resolver.service';
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
    path: '', title: TitleResolverService, component: HomeComponent, children: [
      { path: 'about', title: TitleResolverService, component: AboutComponent }
    ]
  }
];

describe('TitleResolverService', () => {
  let fixture: ComponentFixture<RoutingComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })
      ],
      declarations: [
        RoutingComponent,
        HomeComponent,
        AboutComponent
      ],
      providers: [
        { provide: TitleStrategy, useClass: TitleStrategyService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RoutingComponent);
  });

  it('should resolve title for root', inject([Router, Title], async (router: Router, title: Title) => {
    await router.navigate(['']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed');
  }));

  it('should resolve title for child', inject([Router, Title], async (router: Router, title: Title) => {
    await router.navigate(['about']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - About');
  }));
});
