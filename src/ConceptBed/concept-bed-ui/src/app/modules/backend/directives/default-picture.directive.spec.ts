import { TestBed } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';

import { DefaultPictureDirective } from './default-picture.directive';

@Component({
  template: `<img defaultPicture>Component</h2>`
})
class TestComponent { onEscape(): void { } }

describe('DefaultPictureDirective', () => {
  let element: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useClass: TestComponent }
      ]
    });
    element = TestBed.inject(ElementRef);
  });

  it('should create an instance', () => {
    const directive = new DefaultPictureDirective(element);
    expect(directive).toBeTruthy();
  });
});
