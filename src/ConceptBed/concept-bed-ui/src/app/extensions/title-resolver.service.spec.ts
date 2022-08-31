import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router, Routes, TitleStrategy } from '@angular/router';

import { TitleResolverService } from './title-resolver.service';
import { TitleStrategyService } from './title-strategy.service';
import { Title } from '@angular/platform-browser';

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

  beforeEach(() => {
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

  it('should be created', inject([Router, Title], async (router: Router, title: Title) => {
    router.navigate(['']);
    await fixture.whenStable();
    expect(title.getTitle()).toEqual('Concept Bed - Home');
  }));
});
