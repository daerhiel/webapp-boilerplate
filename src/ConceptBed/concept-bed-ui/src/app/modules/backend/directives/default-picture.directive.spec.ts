import { inject, TestBed } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DefaultPictureDirective } from './default-picture.directive';

@Component({
  template: `<img src="https://test/unknown" defaultPicture />`
})
class TestComponent { }

describe('DefaultPictureDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DefaultPictureDirective
      ],
      providers: [
        { provide: ElementRef, useClass: TestComponent }
      ]
    }).compileComponents();
  });

  it('should create an instance', inject([ElementRef<HTMLImageElement>], (element: ElementRef<HTMLImageElement>) => {
    const directive = new DefaultPictureDirective(element);
    expect(directive).toBeTruthy();
  }));

  it('should set default picture url', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    const img = fixture.debugElement.query(By.directive(DefaultPictureDirective));
    expect(img).not.toBeNull();

    img.triggerEventHandler('error');
    expect(img.nativeElement.src).toMatch(/assets\/images\/default-profile.jpg$/i);
  });
});
