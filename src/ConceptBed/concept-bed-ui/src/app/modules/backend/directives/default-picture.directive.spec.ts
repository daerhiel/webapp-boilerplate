import { inject, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';

import { DefaultPictureDirective } from './default-picture.directive';

@Component({
  template: `<img src="https://test/unknown" defaultPicture />`
})
class TestComponent { }

describe('DefaultPictureDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DefaultPictureDirective
      ],
      providers: [
        { provide: ElementRef, useClass: TestComponent }
      ]
    }).compileComponents();
  });

  it('should create an instance', inject([ElementRef<HTMLIFrameElement>], (element: ElementRef<HTMLImageElement>) => {
    const directive = new DefaultPictureDirective(element);
    expect(directive).toBeTruthy();
  }));

  it('should set default picture url', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    const element: HTMLElement = fixture.nativeElement;

    const img = element.querySelector('img');
    expect(img).not.toBeNull();

    new DebugElement(img!).triggerEventHandler('error');
    expect(img!.src).toMatch(/assets\/images\/default-profile.jpg$/i);
  });
});
