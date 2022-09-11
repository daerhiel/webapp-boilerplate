import { TestBed } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';

import { EscapeDirective } from './escape.directive';

@Component({
  template: `<div (escape)="onEscape()">Component</h2>`
})
class TestComponent { onEscape(): void { } }

describe('EscapeDirective', () => {
  let element: ElementRef;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useClass: TestComponent }
      ]
    }).compileComponents();
    element = TestBed.inject(ElementRef);
  });

  it('should create an instance', () => {
    const directive = new EscapeDirective(element);
    expect(directive).toBeTruthy();
  });
});
